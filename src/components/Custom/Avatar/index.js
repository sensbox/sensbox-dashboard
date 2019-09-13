import React from 'react'
import { Avatar, Tooltip } from "antd";

class CustomAvatar extends React.Component {
  static defaultProps = {
    user: {},
    size: null,
  }

  render() {
    const { user, size } = this.props
    let src = "";
    if (user.profilePhoto){
      src = user.profilePhoto.url;
    };
    return (
      <Tooltip title={user.username || 'Unknown'}>
        <Avatar size={size} icon="user" src={src} />
      </Tooltip>
    )
  }
}

export default CustomAvatar
