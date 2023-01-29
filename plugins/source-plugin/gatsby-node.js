/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
// You can delete this file if you're not using it

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.com/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */
const axios = require('axios');

exports.onPreInit = () => console.log("Loaded ships");

// constants for your GraphQL Post and Author types
const SHIP_NODE_TYPE = `Ship`;

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  const { createNode } = actions

    let shipsleft = true;
    let currentpage = 1;
    let ships = [];

    while (shipsleft) {
        let shippages = await getShipsPage(currentpage); 
        ships.push(...shippages.results);
        if (!shippages?.next) {
            shipsleft = false;
        } else {
            currentpage++;
        }
    }
    
  // loop through data and create Gatsby nodes
  ships.forEach(ship =>
    createNode({
      ...ship,
      id: createNodeId(`${SHIP_NODE_TYPE}-${ship.name}`),
      parent: null,
      children: [],
      internal: {
        type: SHIP_NODE_TYPE,
        content: JSON.stringify(ship),
        contentDigest: createContentDigest(ship),
      },
    })
  )

  return
}

async function getShipsPage(page = 1) {
    const ships = await axios.get(`https://swapi.dev/api/starships/?page=${page}`);
    return ships.data;
}