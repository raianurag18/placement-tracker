import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Building2 } from 'lucide-react';
import { getCompaniesList } from '../api/placementApi';

const CompaniesPage = () => {
  const { collegeSlug } = useParams();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompaniesList(collegeSlug);
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching companies:', err.message);
      }
    };
    if (collegeSlug) fetchCompanies();
  }, [collegeSlug]);

  const companyLogos = {
    Google: '/logos/google.png',
    Microsoft: '/logos/microsoft.svg',
    Amazon: '/logos/amazon.svg',
    Salesforce: '/logos/salesforce.svg',
    Flipkart: '/logos/flipkart.svg',
    Adobe: '/logos/adobe.svg',
    Oracle: '/logos/oracle.svg',
    Zomato: '/logos/zomato.svg',
    Swiggy: '/logos/swiggy.svg',
    Paytm: '/logos/paytm.svg',
    Uber: '/logos/uber.png',
    Ola: '/logos/ola.svg',
    Infosys: '/logos/infosys.svg',
    TCS: '/logos/tcs.svg',
    Wipro: '/logos/wipro.svg',
    HCL: '/logos/hcl.svg',
    "Tech Mahindra": '/logos/techm.svg',
    Capgemini: '/logos/capgemini.svg',
    Cognizant: '/logos/cognizant.svg',
    Mindtree: '/logos/mindtree.svg',
    "L&T Infotech": '/logos/lti.svg',
    Mphasis: '/logos/mphasis.svg',
    Hexaware: '/logos/hexaware.svg',
    Persistent: '/logos/persistent.svg',
    Coforge: '/logos/coforge.svg',
    Accenture: '/logos/accenture.svg',
    'Bajaj Auto': '/logos/bajaj.svg',
    Bosch: '/logos/bosch.svg',
    Deloitte: '/logos/deloitte.svg',
    EY: '/logos/ey.svg',
    Havells: '/logos/havells.svg',
    ABB: '/logos/abb.svg',
    "Ashok Leyland": '/logos/ashokleyland.svg',
    "Crompton Greaves": '/logos/cromptongreaves.svg',
    "Schneider Electric": '/logos/schneider.svg',
    Siemens: '/logos/siemens.svg',
    "Tata Motors": '/logos/tatamotors.svg',
    "John Deere": '/logos/johndeere.svg',
    KPMG: '/logos/kpmg.svg',
    "Larsen & Toubro": '/logos/larsen.svg',
    "Mahindra & Mahindra": '/logos/mahindra.svg',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 mb-4">
          Partner Companies
        </h1>
        <p className="text-lg text-slate-500">
          Explore placement opportunities from our top recruiting partners.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {companies.map((company, index) => (
          <Link to={`company/${encodeURIComponent(company)}`} key={index}>
            <Card className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg">{company}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-32 pt-0">
                {companyLogos[company] ? (
                  <img
                    src={companyLogos[company]}
                    alt={`${company} logo`}
                    className="h-16 max-w-[80%] object-contain opacity-90 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage;
