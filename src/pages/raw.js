import React from 'react';
import { graphql } from 'gatsby';

const Page = ({ data }) => {
  return (
    <pre className="text-xs bg-gray-50 p-4">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export const query = graphql`
  {
    allCashrewardsDeals(
      filter: {
        endDateTime: { eq: "1980-11-23T05:00:00+0000" }
      }
    ) {
      nodes {
        id
        merchant {
          id
        }
        endDateTime
        title
      }
    }
  }
`;

export default Page;