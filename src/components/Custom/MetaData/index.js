import React from 'react'

import CustomAvatar from 'components/Custom/Avatar'
import style from './style.module.scss'


class MetaData extends React.Component {

  render() {
    const { item, align = 'left' } = this.props;
    // const alignClass = (align) ? `${style.textAlignXsCenter} w-100 text-md-${align} ` : `${style.textAlignXsCenter} w-100 text-md-left`;
    const alignClasses = {
      left: {
        container: `text-md-${align}`,
        col1: `${style.customCol} ${style.textAlignXsCenter} ant-col-md-12 ant-col-xl-8 text-md-left`,
        col2: `${style.customCol} ${style.textAlignXsCenter} ant-col-md-12 ant-col-xl-16  text-md-left`
      },
      center: {
        container: `text-md-${align}`,
        col1: `${style.customCol} ${style.textAlignXsCenter} ant-col-md-12 text-md-right`,
        col2: `${style.customCol} ${style.textAlignXsCenter} ant-col-md-12 text-md-left`
      },
      right: {
        container: `text-md-${align}`,
        col1: `${style.customCol} ${style.textAlignXsCenter} ant-col-md-12 text-md-right`,
        col2: `${style.customCol} ${style.textAlignXsCenter} ant-col-md-12 text-md-right`
      },
    }

    const metadata = {
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
      createdAt: item.createdAt && new Date(item.createdAt).toLocaleString(),
      updatedAt: item.updatedAt && new Date(item.updatedAt).toLocaleString(),
    };
    return (
      <div className={`${alignClasses[align].container}`}>
        <h5 className="mx-2 mb-3 text-black">
          <strong>Metadata</strong>
        </h5>
        <dl className="ant-row">
          <dt className={`${alignClasses[align].col1}`}>Created by:</dt>
          <dd className={`${alignClasses[align].col2}`}><CustomAvatar user={metadata.createdBy} /></dd>
        </dl>

        <dl className="ant-row">
          <dt className={`${alignClasses[align].col1}`}>Updated by:</dt>
          <dd className={`${alignClasses[align].col2}`}><CustomAvatar user={metadata.updatedBy} /></dd>
        </dl>

        <dl className="ant-row">
          <dt className={`${alignClasses[align].col1}`}>Created:</dt>
          <dd className={`${alignClasses[align].col2}`}>{metadata.createdAt}</dd>
        </dl>

        <dl className="ant-row">
          <dt className={`${alignClasses[align].col1}`}>Updated:</dt>
          <dd className={`${alignClasses[align].col2}`}>{metadata.updatedAt}</dd>
        </dl>

      </div>
    )
  }
}


export default MetaData