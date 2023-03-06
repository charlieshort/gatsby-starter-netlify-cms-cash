import React from "react"
import { graphql } from "gatsby"

const HomePage = ({ data }) => {
  //console.log(data);
  return (
    <>
      <h1>Deals</h1>
      {data.allCashrewards.edges.map(deal => (
        <div id={deal.node.id}>
          <h3>{deal.node.title}</h3>
          <p>Model: {deal.node.title}</p>
          <p>hyperdrive_rating: {deal.node.merchant.name}</p>
        </div>
      ))}
    </>)
};

export const query = graphql`
  query {
    allCashrewards {
      edges {
        node {
          id
          title
          merchant {
            name
          }
        }
      }
    }
  }
`

export default HomePage;