import { GetServerSideProps } from 'next';

export default function Franchises() {
  // This page never renders - it just redirects
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/franchise',
      permanent: false,
    },
  };
}; 