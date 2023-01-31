import React from "react"
import { graphql } from "gatsby"

export default function Component(props) {
  return props.params.title + JSON.stringify(props.data.deal)
}

// This is the page query that connects the data to the actual component. Here you can query for any and all fields
// you need access to within your code. Again, since Gatsby always queries for `id` in the collection, you can use that
// to connect to this GraphQL query.

export const query = graphql`
  query($id: String) {
    deal(id: { eq: $id }) {
      title
      merchant {
        name
    }
  }
}
`