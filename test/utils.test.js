const mocha = require('mocha');
const chai = require('chai');

const { composeSqlWhereClause, getSortByClause } = require('../utils');

const expect = chai.expect;

describe('composeSqlWhereClause', () => {
  let allowedKeys;
  let query;
  let result;

  beforeEach(() => {
    allowedKeys = ['foo', 'start_date', 'end_date'];
    query = {
      start_date: '2019-01-01',
      end_date: '2019-02-01',
      foo: 'bar'
    };
    result = composeSqlWhereClause(query, allowedKeys);
  });

  it('returns an empty string and an empty array as a double if the passed query is empty', () => {
    const resultWithNoQuery = composeSqlWhereClause({}, allowedKeys);
    expect(resultWithNoQuery[0]).to.equal('');
    expect(resultWithNoQuery[1].length).to.equal(0);
  });

  it('returns an empty string and an empty array as a double if the passed allowedKeys array is empty', () => {
    const resultWithNoAllowedKeys = composeSqlWhereClause({}, []);
    expect(resultWithNoAllowedKeys[0]).to.equal('');
    expect(resultWithNoAllowedKeys[1].length).to.equal(0);
  });

  describe('the first item of the returned double', () => {
    it('is a SQL WHERE clause string', () => {
      expect(typeof result[0]).to.equal('string');
      expect(result[0].includes('WHERE')).to.equal(true);
    });
    it('matches the allowedKeys to appropriate filter strings, replaces values with ?s, and joins the filters with AND', () => {
      expect(result[0]).to.equal('WHERE created_at >= ? AND created_at <= ? AND foo = ?');
    });
    it('does not include any NOT allowed keys in the output', () => {
      allowedKeys = ['foo', 'start_date'];
      result = composeSqlWhereClause(query, allowedKeys);
      expect(result[0]).to.equal('WHERE created_at >= ? AND foo = ?');
    });
  });

  describe('the second item of the returned double', () => {
    it('is an array equal in length to the number of allowed keys found in the query', () => {
      expect(Array.isArray(result[1])).to.equal(true);
      expect(result[1].length).to.equal(3);
    });
    it('appends the start/end of day time to start_date or end_date query params', () => {
      expect(result[1][0]).to.equal('2019-01-01 00:00:00');
      expect(result[1][1]).to.equal('2019-02-01 23:59:59');
    });
    it('does not include any values associated with NOT allowed keys', () => {
      query = { bat: 'baz' };
      result = composeSqlWhereClause(query, allowedKeys);
      expect(result[1].includes('baz')).to.equal(false);
    });
  });
});

describe('getSortByClause', () => {
  let query;
  let allowedParams;
  let defaultSortParam;
  let result;

  beforeEach(() => {
    query = {
      foo: 'bar',
      sort: 'count'
    };
    allowedParams = ['count'];
    defaultSortParam = 'created_at';
    result = getSortByClause(query, allowedParams, defaultSortParam);
  });

  it('returns an ORDER BY clause with the sort from the passed query if it is in the allowed params', () => {
    expect(result).to.equal('ORDER BY count');
  });

  it('returns an ORDER BY clause with the defaultSortParam if query.sort is undefined', () => {
    query = {};
    expect(getSortByClause(query, allowedParams, defaultSortParam)).to.equal('ORDER BY created_at');
  });

  it('returns an ORDER BY clause with the defaultSortParam if query.sort is not an allowed param', () => {
    query = { sort: 'updated_at' };
    expect(getSortByClause(query, allowedParams, defaultSortParam)).to.equal('ORDER BY created_at');
  });
});
