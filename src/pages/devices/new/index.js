import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd';
import { Helmet } from 'react-helmet'

import DeviceForm  from "../form";


const mapStateToProps = ({ resource }) => ({
  saving: resource.saving,
  current: resource.current,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class DeviceNew extends React.Component {

  constructor(props) {
    super(props);
    this.saveAction = this.saveAction.bind(this);
  }

  componentDidUpdate() {
    const { current } = this.props;
    console.log("CURRENT", current);
    if( current && current.objectId ){
      const { history } = this.props;
      history.push({
        pathname: `/devices/settings/${current.uuid}`,
        state: { device: current }
      });
    }
  }

  saveAction(formData) {
    // eslint-disable-next-line no-unused-vars
    const { current, dispatch } = this.props;
    console.log("GUARDANDO", formData);
    dispatch({
      type: 'resource/CREATE',
      payload: {
        className: 'Device',
        data: formData,
        notify: true
      }
    });
  }

  render() {
    const { saving, current, formErrors, history} = this.props
    
    return (
      <div>
        <Helmet title="New Device" />
        <PageHeader className="mb-2" onBack={() => history.goBack()} title="New Device" />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                <DeviceForm
                  device={current}
                  disableSaveButton={saving}
                  saveAction={this.saveAction}
                  errors={formErrors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DeviceNew;
