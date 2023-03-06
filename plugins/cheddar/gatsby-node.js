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

exports.onPreInit = () => console.log("Loaded Cheddar");

// constants for your GraphQL Post and Author types
const CHEDDAR_NODE_TYPE = `Cheddar`;

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
        //console.log(dealpages.data.data.deals);
        deals.push(...dealpages.data.data.deals);
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
      id: createNodeId(`${CHEDDAR_NODE_TYPE}-${deal.id}`),
      parent: null,
      children: [],
      internal: {
        type: CHEDDAR_NODE_TYPE,
        content: JSON.stringify(deal),
        contentDigest: createContentDigest(deal),
      },
    })
  )

  return
}

async function getDealsPage(page = 1) {
    const url = 'https://www.getcheddar.com.au/api/graphql';
  const data = {"operationName":"getDealViewWithFeedRankUnrandomised","variables":{"offset":24,"limit":24,"now":"2023-01-28T04:31:15.697Z","oneDayEarlier":"2023-01-27T04:31:15.697Z"},"query":"fragment WebDealViewWithFeedRankUnrandomisedFields on deal_view_with_feed_rank_unrandomised {\n  id\n  title\n  subtitle\n  scheduledTo\n  heroImageUrl\n  moreInfo\n  boosted\n  offer {\n    merchant {\n      id\n      logoUrl\n      name\n      termsAndConditions\n      heroImageUrl\n      merchantAliases(limit: 1, order_by: {createdAt: desc}) {\n        alias\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  dealAliases(limit: 1, order_by: {createdAt: desc}) {\n    alias\n    __typename\n  }\n  dealCategories {\n    category {\n      category\n      categoryAliases(limit: 1, order_by: {createdAt: desc}) {\n        alias\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nquery getDealViewWithFeedRankUnrandomised($now: timestamptz!, $oneDayEarlier: timestamptz!, $offset: Int = 0, $limit: Int = 24) {\n  epic: deal_view_with_feed_rank_unrandomised(\n    limit: 1\n    order_by: {dealFeedRankUnrandomised: desc}\n    where: {scheduledTo: {_gte: $now}, adult: {_eq: false}, boosted: {_eq: false}, hidden: {_eq: false}, platform: {_neq: \"app\"}}\n  ) {\n    ...WebDealViewWithFeedRankUnrandomisedFields\n    __typename\n  }\n  boosts: deal_view_with_feed_rank_unrandomised(\n    order_by: {dealFeedRankUnrandomised: desc}\n    where: {scheduledTo: {_gte: $now}, adult: {_eq: false}, boosted: {_eq: true}, hidden: {_eq: false}, platform: {_neq: \"app\"}}\n  ) {\n    ...WebDealViewWithFeedRankUnrandomisedFields\n    __typename\n  }\n  fresh: deal_view_with_feed_rank_unrandomised(\n    limit: 10\n    order_by: {dealFeedRankUnrandomised: desc}\n    where: {scheduledTo: {_gte: $now}, scheduledFrom: {_gte: $oneDayEarlier}, adult: {_eq: false}, boosted: {_eq: false}, searchable: {_eq: true}, hidden: {_eq: false}, platform: {_neq: \"app\"}}\n  ) {\n    ...WebDealViewWithFeedRankUnrandomisedFields\n    __typename\n  }\n  deals: deal_view_with_feed_rank_unrandomised(\n    limit: $limit\n    order_by: [{dealFeedRankUnrandomised: desc}, {title: desc}]\n    where: {adult: {_eq: false}, boosted: {_eq: false}, searchable: {_eq: true}, hidden: {_eq: false}, scheduledTo: {_gte: $now}, platform: {_neq: \"app\"}}\n    offset: $offset\n  ) {\n    ...WebDealViewWithFeedRankUnrandomisedFields\n    __typename\n  }\n  otherAggregator: deal_view_with_feed_rank_unrandomised_aggregate(\n    where: {adult: {_eq: false}, boosted: {_eq: false}, searchable: {_eq: true}, hidden: {_eq: false}, scheduledTo: {_gte: $now}}\n  ) {\n    aggregate {\n      count\n      __typename\n    }\n    __typename\n  }\n}"};
  // Specifying headers in the config object
  const config = { 'content-type': 'application/json' };
    const deals = await axios.post(url, data, config);
    //return JSON.stringify(deals);
    return deals;
    //console.log(deals);
}

