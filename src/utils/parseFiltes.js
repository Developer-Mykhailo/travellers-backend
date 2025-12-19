export const parseFilters = async ({ category, owner, query, name }) => {
  const result = {};

  //todo category
  if (category) {
    const categoryArray = Array.isArray(category) ? category : [category];
    result.categoryRegex = new RegExp(categoryArray.join('|'), 'i');
  }

  //todo owner
  if (owner) {
    const ownerArray = Array.isArray(owner) ? owner : [owner];
    result.ownerRegex = new RegExp(ownerArray.join('|'), 'i');
  }

  //todo search
  if (query) {
    result.search = new RegExp(query, 'i');
  }

  //todo users
  if (name) {
    const nameArray = Array.isArray(name) ? name : [name];
    result.nameRegex = new RegExp(nameArray.join('|'), 'i');
  }

  return result;
};
