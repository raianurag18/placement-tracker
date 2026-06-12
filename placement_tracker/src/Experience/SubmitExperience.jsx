import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { PlusCircle, Trash2, Loader2, ChevronDown, Lightbulb, Clock } from 'lucide-react';
import { submitExperience } from '../api/experienceApi';

/**
 * SubmitExperience
 *
 * Purpose: Allows a logged-in student to submit their interview experience.
 * The form matches the full Experience model in the backend:
 *   - Basic info: name, company, role, package, experience summary
 *   - Verdict: Selected / Rejected / Pending
 *   - Difficulty: Easy / Medium / Hard
 *   - Rounds: Dynamic array of { name, description, questions[] }
 *   - Tips: Dynamic array of tip strings
 *
 * ⚠️ INTERVIEW TIP: The pattern for dynamic arrays in React forms is:
 *   1. Store array in state
 *   2. Map over it to render fields
 *   3. "Add" button pushes a new empty object into the array
 *   4. "Remove" button filters out the item at that index
 *   This is the exact pattern used by Google Forms, Notion, etc.
 */
const SubmitExperience = () => {
  const { collegeSlug } = useParams();
  const navigate = useNavigate();

  // ── Basic Fields (simple key-value pairs) ──────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    package: '',
    experience: '',      // Overall summary of the experience
    difficulty: 'Medium', // Dropdown: Easy, Medium, Hard
    verdict: 'Selected',  // Dropdown: Selected, Rejected, Pending
  });

  // ── Dynamic Fields (arrays that grow/shrink) ───────────────────────────────
  // Each round has: { name, description, questions: ['', ''] }
  const [rounds, setRounds] = useState([
    { name: '', description: '', questions: [''] }
  ]);

  // Each tip is just a string
  const [tips, setTips] = useState(['']);

  // ── UI State ───────────────────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // ✅ Added state for success screen

  // ── Handler: Basic Fields ──────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Handlers: Rounds (Dynamic Array) ──────────────────────────────────────

  // Update a specific field (name or description) of a specific round
  const handleRoundChange = (roundIndex, field, value) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        return { ...round, [field]: value };
      }
      return round;
    });
    setRounds(updatedRounds);
  };

  // Update a specific question inside a specific round
  const handleQuestionChange = (roundIndex, questionIndex, value) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        const updatedQuestions = round.questions.map((q, j) =>
          j === questionIndex ? value : q
        );
        return { ...round, questions: updatedQuestions };
      }
      return round;
    });
    setRounds(updatedRounds);
  };

  // Add a new empty round to the end of the list
  const addRound = () => {
    setRounds([...rounds, { name: '', description: '', questions: [''] }]);
  };

  // Remove a round by index
  const removeRound = (roundIndex) => {
    setRounds(rounds.filter((_, i) => i !== roundIndex));
  };

  // Add a new empty question to a specific round
  const addQuestion = (roundIndex) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        return { ...round, questions: [...round.questions, ''] };
      }
      return round;
    });
    setRounds(updatedRounds);
  };

  // Remove a question from a specific round by index
  const removeQuestion = (roundIndex, questionIndex) => {
    const updatedRounds = rounds.map((round, i) => {
      if (i === roundIndex) {
        return {
          ...round,
          questions: round.questions.filter((_, j) => j !== questionIndex)
        };
      }
      return round;
    });
    setRounds(updatedRounds);
  };

  // ── Handlers: Tips (Dynamic Array of Strings) ──────────────────────────────

  const handleTipChange = (index, value) => {
    const updatedTips = tips.map((tip, i) => (i === index ? value : tip));
    setTips(updatedTips);
  };

  const addTip = () => {
    setTips([...tips, '']);
  };

  const removeTip = (index) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  // ── Submit Handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Business Logic: Validate required basic fields
    const { name, company, role, package: pkg, experience } = formData;
    if (!name || !company || !role || !pkg || !experience) {
      setError('Please fill out all required fields (Name, Company, Role, Package, Experience Summary).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Business Logic: Clean up arrays before sending:
      // - Filter out empty tip strings
      // - Filter out rounds with no name, and filter empty questions within rounds
      const cleanTips = tips.filter(tip => tip.trim() !== '');
      const cleanRounds = rounds
        .filter(round => round.name.trim() !== '')
        .map(round => ({
          ...round,
          questions: round.questions.filter(q => q.trim() !== '')
        }));

      // Build the final payload — matches the Experience Mongoose schema exactly
      const payload = {
        ...formData,
        rounds: cleanRounds,
        tips: cleanTips,
      };

      await submitExperience(collegeSlug, payload);
      
      // ✅ FIX: Instead of navigating away which unmounts the component instantly,
      // we clear the form data and show a dedicated success screen.
      setFormData({
        name: '', company: '', role: '', package: '', experience: '',
        difficulty: 'Medium', verdict: 'Selected'
      });
      setRounds([{ name: '', description: '', questions: [''] }]);
      setTips(['']);
      setIsSubmitted(true); // Trigger the success screen

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── UI: Select field base styles ───────────────────────────────────────────
  const selectStyle = "w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer";

  // ✅ Render the success screen if submission was successful
  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-in zoom-in duration-500">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200">
          <span className="text-5xl">🎉</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3 text-center">Experience Submitted!</h2>
        <p className="text-slate-600 max-w-md text-center mb-8 leading-relaxed">
          Thank you for sharing your journey. Your experience has been saved and is currently pending review by your placement cell. It will be visible to your juniors once approved.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => setIsSubmitted(false)} variant="outline" className="border-slate-300">
            Submit Another
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Link to={`/c/${collegeSlug}/experiences`}>
              Return to Experiences
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 hover:bg-slate-100 text-slate-600">
          <Link to={`/c/${collegeSlug}/dashboard`}>
            ← Back to Dashboard
          </Link>
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Share Your Interview Story</h1>
          <p className="text-slate-500 mt-2">Help your juniors prepare. Your experience will be reviewed before publishing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── SECTION 1: Basic Info ─────────────────────────────────────── */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Basic Information</CardTitle>
              <CardDescription>Tell us about the company and role you interviewed for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Success / Error Messages */}
              {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">{success}</div>}
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">{error}</div>}

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Your Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" placeholder="e.g., Rahul Sharma" value={formData.name} onChange={handleChange} className="bg-white border-slate-200 text-slate-900" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company" className="text-slate-700 font-medium">Company <span className="text-red-500">*</span></Label>
                  <Input id="company" name="company" placeholder="e.g., Google" value={formData.company} onChange={handleChange} className="bg-white border-slate-200 text-slate-900" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-slate-700 font-medium">Role <span className="text-red-500">*</span></Label>
                  <Input id="role" name="role" placeholder="e.g., Software Engineer" value={formData.role} onChange={handleChange} className="bg-white border-slate-200 text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="package" className="text-slate-700 font-medium">Package <span className="text-red-500">*</span></Label>
                  <Input id="package" name="package" placeholder="e.g., 45 LPA" value={formData.package} onChange={handleChange} className="bg-white border-slate-200 text-slate-900" />
                </div>

                {/* Difficulty Dropdown */}
                <div className="grid gap-2">
                  <Label htmlFor="difficulty" className="text-slate-700 font-medium">Difficulty</Label>
                  <div className="relative">
                    <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className={selectStyle}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Verdict Dropdown */}
                <div className="grid gap-2">
                  <Label htmlFor="verdict" className="text-slate-700 font-medium">Verdict</Label>
                  <div className="relative">
                    <select id="verdict" name="verdict" value={formData.verdict} onChange={handleChange} className={selectStyle}>
                      <option value="Selected">Selected ✅</option>
                      <option value="Rejected">Rejected ❌</option>
                      <option value="Pending">Pending ⏳</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="experience" className="text-slate-700 font-medium">Overall Experience Summary <span className="text-red-500">*</span></Label>
                <Textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  placeholder="Briefly describe the overall interview experience, process, and your key takeaway..."
                  value={formData.experience}
                  onChange={handleChange}
                  className="bg-white border-slate-200 text-slate-900 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── SECTION 2: Interview Rounds ───────────────────────────────── */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg text-slate-800">Interview Rounds</CardTitle>
              </div>
              <CardDescription>Describe each round in detail. This is the most valuable section for juniors!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/50 relative">

                  {/* Round Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">Round {roundIndex + 1}</span>
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(roundIndex)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Remove this round"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Round Name */}
                  <div className="grid gap-2">
                    <Label className="text-slate-700 text-sm font-medium">Round Name</Label>
                    <Input
                      placeholder="e.g., Online Assessment, Technical Interview, HR Round"
                      value={round.name}
                      onChange={(e) => handleRoundChange(roundIndex, 'name', e.target.value)}
                      className="bg-white border-slate-200 text-slate-900"
                    />
                  </div>

                  {/* Round Description */}
                  <div className="grid gap-2">
                    <Label className="text-slate-700 text-sm font-medium">Description</Label>
                    <Textarea
                      placeholder="What happened in this round? What topics were covered?"
                      rows={2}
                      value={round.description}
                      onChange={(e) => handleRoundChange(roundIndex, 'description', e.target.value)}
                      className="bg-white border-slate-200 text-slate-900 resize-none"
                    />
                  </div>

                  {/* Questions inside this round */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 text-sm font-medium">Key Questions Asked</Label>
                    {round.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold text-sm w-5 shrink-0">Q{questionIndex + 1}.</span>
                        <Input
                          placeholder="e.g., Find the lowest common ancestor of a BST"
                          value={question}
                          onChange={(e) => handleQuestionChange(roundIndex, questionIndex, e.target.value)}
                          className="bg-white border-slate-200 text-slate-900"
                        />
                        {round.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(roundIndex, questionIndex)}
                            className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {/* Add Question to this round */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addQuestion(roundIndex)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-3 text-xs"
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add Question
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Round Button */}
              <Button
                type="button"
                variant="outline"
                onClick={addRound}
                className="w-full border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Another Round
              </Button>
            </CardContent>
          </Card>

          {/* ── SECTION 3: Tips ───────────────────────────────────────────── */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg text-amber-800">Advice for Aspirants</CardTitle>
              </div>
              <CardDescription className="text-amber-700/70">What would you tell someone preparing for this company?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-sm w-5 shrink-0">{index + 1}.</span>
                  <Input
                    placeholder="e.g., Practice Dynamic Programming problems on LeetCode"
                    value={tip}
                    onChange={(e) => handleTipChange(index, e.target.value)}
                    className="bg-white border-amber-200 text-slate-900 focus:border-amber-400"
                  />
                  {tips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTip(index)}
                      className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addTip}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 h-8 px-3 text-xs"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add Another Tip
              </Button>
            </CardContent>
          </Card>

          {/* ── Submit Button ─────────────────────────────────────────────── */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</>
            ) : (
              'Submit Experience'
            )}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default SubmitExperience;
