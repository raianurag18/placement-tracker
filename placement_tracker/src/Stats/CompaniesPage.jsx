import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placements/companies`)
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error('Error fetching companies:', err));
  }, []);

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
    <div className="min-h-screen text-white">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          Companies
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((company, index) => (
            <Link to={`/companies/${company}`} key={index}>
              <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-center">{company}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                  {companyLogos[company] ? (
                    <img src={companyLogos[company]} alt={`${company} logo`} className="h-24 filter brightness-0 invert" /> // Invert logos to white if they are black
                  ) : (
                    <div className="h-24 flex items-center justify-center text-xl font-semibold text-gray-400">
                      {company}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CompaniesPage;
