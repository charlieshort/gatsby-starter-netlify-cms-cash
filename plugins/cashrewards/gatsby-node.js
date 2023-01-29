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

exports.onPreInit = () => console.log("Loaded cashrewards");

// constants for your GraphQL Post and Author types
const DEAL_NODE_TYPE = `Deal`;

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  const { createNode } = actions

    let dealsleft = true;
    let currentpage = 1;
    let deals = [];

    while (dealsleft) {
        let dealpages = await getDealsPage(currentpage); 
        deals.push(...dealpages.data);
        if (!dealpages?.next) {
            dealsleft = false;
        } else {
            currentpage++;
        }
    }
    
  // loop through data and create Gatsby nodes
  deals.forEach(deal =>
    createNode({
      ...deal,
      id: createNodeId(`${DEAL_NODE_TYPE}-${deal.title}`),
      parent: null,
      children: [],
      internal: {
        type: DEAL_NODE_TYPE,
        content: JSON.stringify(deal),
        contentDigest: createContentDigest(deal),
      },
    })
  )

  return
}

async function getDealsPage(page = 1) {
    const deals = await axios.get(`https://www.cashrewards.com.au/api/offers/v1/Offers?clientId=1000000&isFeatured=false`);
    return deals.data;
}