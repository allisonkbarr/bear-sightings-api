const addEndOfDayTimestamp = (date) => `${date} 23:59:59`;
const addStartOfDayTimestamp = (date) => `${date} 00:00:00`;

const composeSqlWhereClause = (query, allowedKeys) => {
  const conditions = [];
  const args = [];

  for (const key in query) {
    if (allowedKeys.includes(key)) {
      switch (key) {
        case 'start_date':
          conditions.push('created_at >= ?');
          args.push(addStartOfDayTimestamp(query.start_date));
          break;
        case 'end_date':
          conditions.push('created_at <= ?');
          args.push(addEndOfDayTimestamp(query.end_date));
          break;
        default:
          conditions.push(`${key} = ?`);
          args.push(query[key]);
      }
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return [whereClause, args];
};


const getSortByClause = (query, allowedParams, defaultSortParam) => {
  if (allowedParams.includes(query.sort)) {
    return `ORDER BY ${query.sort}`;
  } else {
    return `ORDER BY ${defaultSortParam}`;
  }
};

module.exports = {
  composeSqlWhereClause,
  getSortByClause
};
