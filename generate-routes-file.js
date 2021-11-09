const fs = require('fs');
const { gql, GraphQLClient } = require('graphql-request');

const routes = [
  '/',
  '/store/products',
];

fs.writeFileSync('routes.txt', routes.join('\n'));

const client = new GraphQLClient('https://api.gaushadhi.com/shop-api')
const query = gql`
  query products($productListOptions: ProductListOptions){
  products(options: $productListOptions) {
    items {
      slug
    }
  }
}
`

const data = client.request(query,
  {
    productListOptions: {
      skip: 0
    }
  }).then((res) => {
    if (res.products && res.products.items && res.products.items.length) {
      res.products.items.forEach((route) => {
        routes.push(`/store/products/${route.slug}`);
      });
    }
}).catch((err) => {
  console.log('ERROR OCCURRED WHILE FETCHING PRODUCTS SLUG.');
})
  .finally(() => {
  fs.writeFileSync('routes.txt', routes.join('\n'));
})

