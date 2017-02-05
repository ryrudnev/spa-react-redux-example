import React, { PropTypes } from 'react';
import BodyClassName from 'react-body-classname';
import { pure } from 'recompose';
import Helmet from 'react-helmet';
import cn from 'classnames/bind';
import { Button } from 'react-bootstrap';
import styles from './styles.css';
import img500 from './500.png';
import img404 from './404.png';

const Errors = ({ classes, goBack, goHome, pageTitle, error, errorsMap }) => {
  const {
    img,
    title = `Ошибка ${error.status}`,
    header = error.statusText,
    message = error.message,
  } = errorsMap[error.status] || {};

  return (
    <div className={classes('error-pages')}>
      <Helmet title={pageTitle || title} />
      <BodyClassName className={classes('error')} />
      {img && <img src={img} alt="error-icon" className={classes('icon')} />}
      <h1>{header}</h1>
      <h4>{message}</h4>
      <div className={classes('bottom-links')}>
        <Button onClick={goBack}>Назад</Button>
        <Button onClick={goHome} bsStyle="primary">На главную</Button>
      </div>
    </div>
  );
};

Errors.propTypes = {
  classes: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
  pageTitle: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
    statusText: PropTypes.string,
    status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  errorsMap: PropTypes.object,
};

Errors.defaultProps = {
  classes: cn.bind(styles),
  pageTitle: '',
  errorsMap: {
    500: {
      img: img500,
      title: 'Ошибка сервера',
      header: 'Внутренняя ошибка сервера!',
    },
    404: {
      img: img404,
      title: 'Ресурс не найден',
      header: 'Ресурс не найден!',
    },
    notfound: {
      img: img404,
      title: 'Страница не найдена',
      header: 'Страница не найдена!',
      message: 'Возможно этой страницы не существуют или она была удалена',
    },
  },
};

export default pure(Errors);
