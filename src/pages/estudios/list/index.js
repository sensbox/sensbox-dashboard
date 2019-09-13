import React from 'react'
import { Tooltip, Row, Switch, Col, Table, Button, Input} from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'


const mapStateToProps = ({ estudios }) => ({
  data: estudios.data,
  total: estudios.total,
  loading: estudios.loading,
})

@connect(mapStateToProps)
class List extends React.Component {
  state = {
    searchField: 'nombre',
    searchText: '',
    sortField: 'nombre',
    sortOrder: 'ascend',
    currentPage: 0,
    limit: 10,
  }

  constructor(props) {
    super(props);
    this.dispatchGetData();
    this.onAdd.bind(this);
  }

  handleTableChange = (pagination, filters, sorters) => {
    const { current } = pagination;
    const { columnKey, order } = sorters;
    const { sortField, sortOrder } = this.state;
    this.setState({
      currentPage: current,
      sortField: columnKey || sortField,
      sortOrder: order || sortOrder,
    }, () => this.dispatchGetData());
  }

  onSearch = (text) => {
    this.setState({ searchText: text, currentPage: 1}, () => this.dispatchGetData());
  } 

  onAdd = () => { 
    const { history } = this.props;
    history.push({
      pathname: '/estudios/new',
    });
  }

  onEdit = (row) => { 
    // console.log(row, this.props);
    const { history } = this.props;
    history.push({
      pathname: '/estudios/edit',
      state: { estudio: row }
    });
  }

  updateActive(objectId, active) {
    const { dispatch } = this.props;
    dispatch({
      type: 'estudios/UPDATE',
      payload: {
        objectId,
        data: { active },
        notify: true
      }
    });
  }

  dispatchGetData() {
    const { dispatch } = this.props;
    const { searchField, searchText, currentPage, limit, sortField, sortOrder } = this.state;

    dispatch({
      type: 'estudios/GET_DATA',
      payload: {
        searchField,
        searchText,
        page: currentPage > 0 ? currentPage - 1 : 0,
        limit,
        sortField,
        sortOrder,
      }
    });
  }

  render() {
    const { data, total, loading } = this.props;
    const { currentPage } = this.state;
    // console.log(loading)
    const pagination = {
      current: currentPage,
      total
    }
    const columns = [
      {
        title: 'Titulo',
        dataIndex: 'titulo',
        key: 'titulo',
        sorter: true,
      },
      {
        title: 'Intervencion',
        dataIndex: 'intervencion',
        key: 'intervencion',
        sorter: true,
      },
      {
        title: 'Número',
        dataIndex: 'numero',
        key: 'numero',
        sorter: true,
      },
      {
        title: 'Patrocinador',
        dataIndex: 'patrocinador',
        key: 'patrocinador',
        sorter: true,
      },
      {
        title: 'Nro Casos',
        dataIndex: 'nroCasos',
        key: 'nroCasos',
        sorter: true,
      },
      {
        title: 'Validado AAOC',
        dataIndex: 'validacionAaoc',
        key: 'validacionAaoc',
        sorter: true,
      },
      {
        title: 'Status Aprobación ANMAT',
        dataIndex: 'aprobacionAnmat',
        key: 'aprobacionAnmat',
        sorter: true,
      },
      {
        title: 'Clasificación General',
        dataIndex: 'clasificacionGeneral',
        key: 'clasificacionGeneral',
        sorter: true,
      },
      {
        title: 'Status',
        key: 'active',
        sorter: true,
        render: (row) => (
          <Tooltip title={row.active ? 'Activado' : 'Desactivado'}>
            <Switch
              size="small"
              checked={row.active}
              onChange={(checked) => this.updateActive(row.objectId, checked)}
            />
          </Tooltip>
        )
      },
      {
        title: 'Action',
        key: 'action',
        render: (row) => (
          <span>
            <Button type="primary" icon="edit" className="mr-1" size="small" onClick={() => this.onEdit(row)}>
              Editar
            </Button>
          </span>
        ),
      },
    ]

    return (
      <div>
        <Helmet title="Estudios" />
        <div className="card">
          <div className="card-header">
            <Row>
              <Col sm={24} md={12}>
                <div className="utils__title">
                  <strong>Estudios</strong>
                </div>
                <div className="utils__titleDescription">Listado de Estudios registrados en el sistema.</div>
              </Col>
              <Col sm={24} md={12}>
                <Input.Search style={{ float: "right", width: 300 }} placeholder="Buscar por nombre" onSearch={this.onSearch} enterButton />
                <Button
                  type="primary"
                  icon="plus"
                  onClick={this.onAdd}
                  style={{ marginRight: 10, float: "right"}}
                >
                  Nuevo Estudio
                </Button>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Table
              rowKey="objectId"
              className="utils__scrollTable"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={data}
              onChange={this.handleTableChange}
              pagination={pagination}
              loading={loading}
              size="middle"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default List
