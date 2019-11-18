exports.formatDates = list => {
  return list.map(obj => {
    const newObj = { ...obj };
    newDate = new Date(newObj.created_at);
    newObj.created_at = newDate;
    console.log(newObj);
    return newObj;
  });
};

exports.makeRefObj = list => {
  const newObj = {};
  list.forEach(item => {
    const titleName = item.title;
    const articles = item.article_id;
    newObj[titleName] = articles;
  });
  return newObj;
};

exports.formatComments = (comments, articleRef) => {
  const newFormattedComments = [];
  comments.forEach(obj => {
    const newObj = { ...obj };

    newObj.article_id = articleRef[newObj.belongs_to];
    delete newObj.belongs_to;
    newObj.author = newObj.created_by;
    delete newObj.created_by;

    newObj.created_at = new Date(newObj.created_at);
    console.log(newObj);
    newFormattedComments.push(newObj);
  });
  return newFormattedComments;
};
