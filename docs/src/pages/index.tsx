import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import GitHubButton from 'react-github-btn';
import classnames from 'classnames';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

const Button = ({children, href}) => {
  return (
    <Link className="button button--outline button--primary button--lg margin-horiz--sm" to={href}>
      {children}
    </Link>
  );
};

const HomeSplash = () => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  return (
    <div className={classnames('hero hero-dark', styles.heroBanner)}>
      <div className="container">
        <img
          className={classnames(styles.heroBannerLogo, 'margin-vert--md')}
          src={useBaseUrl('img/icon.png')}
          alt="React Native Performance logo"
        />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={classnames(styles.heroButtons, 'name', 'margin-vert--md')}>
          <Button href={useBaseUrl('docs/fundamentals/getting-started')}>Get Started</Button>
        </div>
        <GitHubButton
          href="https://github.com/Shopify/react-native-performance"
          data-icon="octicon-star"
          data-size="large"
          data-show-count="true"
          aria-label="Star Shopify/react-native-performance on GitHub"
        >
          Star
        </GitHubButton>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <Layout title="React Native Performance" description="Performance monitoring for React Native apps">
      <HomeSplash />
      <main>
        <div
          className="container"
          style={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
            marginBottom: '2rem',
          }}
        />
      </main>
    </Layout>
  );
}
