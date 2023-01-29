import React from "react"
import { graphql } from "gatsby"

const HomePage = ({ data }) => {
  console.log(data);
  return (
    <>
      <h1>Ships</h1>
      {data.allShip.edges.map(ship => (
        <div id={ship.node.id}>
          <h3>{ship.node.title}</h3>
          <p>Model: {ship.node.title}</p>
          <p>hyperdrive_rating: {ship.node.merchant.name}</p>
        </div>
      ))}
    </>)
};

export const query = graphql`
  query {
    allShip {
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