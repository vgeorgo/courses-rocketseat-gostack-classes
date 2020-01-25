import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSpinner, FaGreaterThan, FaLessThan } from 'react-icons/fa';

import api from '../../services/api';
import Container from '../../components/Container';
import {
  Loading,
  Owner,
  IssueList,
  StateFilter,
  LoadingIssues,
  Pages,
} from './styles';

export default class Repository extends Component {
  pageLimit = 5;

  constructor(props) {
    super(props);

    this.state = {
      repository: {},
      issues: [],
      loading: true,
      loadingIssues: false,
      activeFilter: 'all',
      filters: [
        { key: 'all', name: 'All' },
        { key: 'open', name: 'Open' },
        { key: 'closed', name: 'Closed' },
      ],
      page: 1,
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { activeFilter, page } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: activeFilter,
          per_page: this.pageLimit,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleFilter = key => {
    this.setState({ activeFilter: key, page: 1 });
    this.loadIssues();
  };

  plusPage = () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
    this.loadIssues();
  };

  minusPage = () => {
    const { page } = this.state;
    if (page === 1) return;

    this.setState({ page: page - 1 });
    this.loadIssues();
  };

  async loadIssues() {
    this.setState({ loadingIssues: true });
    const { repository, activeFilter, page } = this.state;
    const response = await api.get(`/repos/${repository.full_name}/issues`, {
      params: {
        state: activeFilter,
        per_page: this.pageLimit,
        page,
      },
    });

    this.setState({
      issues: response.data,
      loadingIssues: false,
    });
  }

  render() {
    const {
      repository,
      issues,
      loading,
      loadingIssues,
      activeFilter,
      filters,
      page,
    } = this.state;

    if (loading) return <Loading>Loading</Loading>;

    return (
      <Container>
        <Owner>
          <Link to="/">Back</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <StateFilter>
          {filters.map(filter => (
            <li key={filter.key}>
              <button
                type="button"
                onClick={() => {
                  this.handleFilter(filter.key);
                }}
                active={activeFilter === filter.key ? 1 : 0}
              >
                {filter.name}
              </button>
            </li>
          ))}
        </StateFilter>

        {loadingIssues ? (
          <LoadingIssues>
            <FaSpinner color="#7159c1" size={40} />
          </LoadingIssues>
        ) : (
          <IssueList>
            {issues.map(issue => (
              <li key={String(issue.id)}>
                <img src={issue.user.avatar_url} alt={issue.user.login} />
                <div>
                  <strong>
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {issue.title}
                    </a>
                    {issue.labels.map(label => (
                      <span key={String(label.id)}>{label.name}</span>
                    ))}
                  </strong>
                  <p>{issue.user.login}</p>
                </div>
              </li>
            ))}
          </IssueList>
        )}

        <Pages>
          <button type="button" onClick={this.minusPage}>
            <FaLessThan color="#FFF" size={14} />
          </button>
          <p>{page}</p>
          <button type="button" onClick={this.plusPage}>
            <FaGreaterThan color="#FFF" size={14} />
          </button>
        </Pages>
      </Container>
    );
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
