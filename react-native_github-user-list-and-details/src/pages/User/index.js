import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: false,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadMore();
  }

  loadMore = async () => {
    const {loading} = this.state;
    // Dont shoot multiple requests
    if (loading) return;

    this.setState(
      {
        loading: true,
      },
      this.fetchData
    );
  };

  refreshList = () => {
    this.setState(
      {
        stars: [],
        page: 1,
        loading: false,
        refreshing: true,
      },
      this.loadMore
    );
  };

  fetchData = async () => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const {stars, page} = this.state;

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);
    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
      loading: false,
      refreshing: false,
    });
  };

  handleNavigate = repository => {
    const {navigation} = this.props;
    navigation.navigate('Detail', {repository});
  };

  render() {
    const {navigation} = this.props;
    const {stars, page, loading, refreshing} = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {page !== 1 ? (
          <Stars
            data={stars}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        ) : (
          <></>
        )}
        {loading ? <ActivityIndicator size="large" color="#7159c1" /> : <></>}
      </Container>
    );
  }
}
