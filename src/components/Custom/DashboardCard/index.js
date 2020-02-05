import React from 'react'
import { Card, Icon, Tooltip } from 'antd'
import Meta from 'antd/lib/card/Meta'
import styles from './style.module.scss'
// import styles from './style.module.scss'

class DashboardCard extends React.Component {
  static defaultProps = {
    title: 'title',
    description: '',
    onClick: () => console.log('click'),
  }

  render() {
    const {
      title,
      description,
      public: pubPerm,
      sharedBy,
      editAction,
      shareAction,
      removeAction,
      onClick,
    } = this.props

    let actions = []
    if (!sharedBy) {
      actions = [
        <div className="actions">
          <Tooltip placement="top" title="Edit">
            <Icon
              className={styles.actionIconEdit}
              type="edit"
              key="edit"
              onClick={e => {
                e.stopPropagation()
                editAction()
              }}
            />
          </Tooltip>
          <Tooltip placement="top" title="Share">
            <Icon
              className={styles.actionIconShare}
              type="share-alt"
              key="share-alt"
              onClick={e => {
                e.stopPropagation()
                shareAction()
              }}
            />
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <Icon
              className={styles.actionIconDelete}
              type="delete"
              key="delete"
              onClick={e => {
                e.stopPropagation()
                removeAction()
              }}
            />
          </Tooltip>
        </div>,
      ]
    } else {
      actions = [
        <span>
          {' '}
          Shared by <b>@{sharedBy.username}</b>
        </span>,
      ]
    }
    return (
      <Card
        bordered
        hoverable
        // bodyStyle={{marginBottom: 0, padding: 0}}
        // style={{ width: 300 }}
        // cover={
        //   <img
        //     alt="example"
        //     src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        //   />
        // }
        actions={actions}
        onClick={onClick}
      >
        <Meta
          // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={
            <div className={styles.title}>
              {title}
              {pubPerm && (
                <Tooltip placement="top" title="Public dashboard">
                  <span className="float-right">
                    <Icon type="team" style={{ color: '#46be8a' }} />
                  </span>
                </Tooltip>
              )}
            </div>
          }
          description={
            <div className={styles.description}>{description || <span>&nbsp;</span>}</div>
          }
        />
        {/* <a href="javascript: void(0);" className="m-1 btn btn-outline-success"> Edit </a>
        <a href="javascript: void(0);" className="m-1 btn btn-outline-danger"> Delete </a> */}
      </Card>
    )
  }
}

export default DashboardCard
