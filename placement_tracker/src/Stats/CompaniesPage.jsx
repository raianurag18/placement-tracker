import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/placements/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error('Error fetching companies:', err));
  }, []);

  const companyLogos = {
    Google: '/logos/google.png',
    Microsoft: '/logos/microsoft.png',
    Amazon: '/logos/amazon.svg',
    Salesforce: '/logos/salesforce.svg',
    Flipkart: '/logos/flipkart.svg',
    Adobe: '/logos/adobe.svg',
    Oracle: '/logos/oracle.svg',
    Zomato: '/logos/zomato.png',
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
    "L&T Infotech": '/logos/lti.png',
    Mphasis: '/logos/mphasis.svg',
    Hexaware: '/logos/hexaware.svg',
    Persistent: '/logos/persistent.svg',
    Coforge: '/logos/coforge.svg',
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          Companies
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((company, index) => (
            <Link to={`/companies/${company}`} key={index}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">{company}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                  {companyLogos[company] ? (
                    <img src={companyLogos[company]} alt={`${company} logo`} className="h-24" />
                  ) : (
                    <div className="h-24 flex items-center justify-center text-xl font-semibold text-muted-foreground">
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
