
import React from 'react';
import Hero from '@/components/Hero';
import FeaturedPackages from '@/components/FeaturedPackages';
import Highlights from '@/components/Highlights';
// import Calculator from '@/components/Calculator'; 
import InquiryForm from '@/components/InquiryForm';
import WhyBookWithUs from '@/components/WhyBookWithUs';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedPackages />
      <Highlights />
      {/* <Calculator /> */}
 
      <WhyBookWithUs />
           <InquiryForm />
      <Testimonials />
      <FAQ />
    </>
  );
};

export default Home;
