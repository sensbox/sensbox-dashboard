import React from 'react'
import { connect } from 'react-redux'

import { Input, InputNumber, Select, Button, message, Form } from 'antd'
import { unescape } from "lodash";
// import { EditorState } from 'draft-js';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import { Editor } from 'react-draft-wysiwyg'
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';


import { Helmet } from 'react-helmet'
import { Redirect, Link } from "react-router-dom";
import LocalidadService  from "../../services/localidad";
import ProvinciaService  from "../../services/provincia";
// import styles from './style.module.scss'

// const { TreeNode } = TreeSelect
const { Option } = Select
const { TextArea } = Input
// const { TextArea } = Input
const FormItem = Form.Item

const findLocalidades = (provincia) => {
  return LocalidadService.find({
    where: { 
      'provincia.nombre': provincia
    },
    sortField: 'nombre',
    limit: 600,
  });
}

const getFormField = (value) => Form.createFormField({ value });

const mapStateToProps = ({ centros }) => ({
  current: centros.current,
  updating: centros.updating,
  objectNotFound: centros.objectNotFound
})

const mapPropsToFields = ({ current }) => {
  console.log(current);
  const { nombre, emailContacto, calle, numero, provincia, localidad, observaciones } = current || {};
  
  return {
    nombre: getFormField(nombre),
    emailContacto: getFormField(emailContacto),
    calle: getFormField(calle),
    numero: getFormField(numero),
    provincia: getFormField(provincia),
    localidad: getFormField(localidad),
    observaciones: getFormField(unescape(observaciones))
  }
}

@connect(mapStateToProps)
@Form.create({ mapPropsToFields })
class CentroEdit extends React.Component {
  state = {
    provincias: [],
    localidades: [],
    loadingLocalidades : false,
  }

  constructor(props) {
    super(props);
    const { dispatch, location } = props;
    if (location.state) {
      dispatch({
        type: 'centros/GET_CURRENT',
        payload: {
          objectId: location.state.centro.objectId
        }
      });
      this.initialize(location.state.centro);
    }
    this.save = this.save.bind(this);
    this.onProvinciaChange = this.onProvinciaChange.bind(this);
  }



  onProvinciaChange(provinciaId) {
    const { form } = this.props;
    const { provincias } = this.state;
    this.setState(
      { loadingLocalidades: true },
      async () => {
        const provincia = provincias.find((i) => i.objectId === provinciaId);
        findLocalidades(provincia.nombre).then((data) => {
          this.setState({ 
              localidades: data.results,
              loadingLocalidades: false,
          }, () => form.setFieldsValue({
              localidad: data.results[0].nombre,
          }));
        });
      }
    );
  }

  initialize(centro) {
    const { provincia } = centro;
    ProvinciaService.find().then((data) => this.setState({ provincias: data.results }));
    findLocalidades(provincia).then((data) => this.setState({ localidades: data.results }));;
  }

  save() {
    const { current, form, dispatch } = this.props;
    const { provincias, localidades } = this.state;

    form.validateFields((err, values) => {
      console.log("GUARDANDO", values);
      if (!err) {
        const provincia = provincias.find((i) => i.objectId === values.provincia);
        const localidad = localidades.find((i) => i.objectId === values.localidad);

        let data = { ...values }
        if (provincia) data = { ...data, provincia: provincia.nombre } ;
        if (localidad) data = { ...data, localidad: localidad.nombre } ;

        dispatch({
          type: 'centros/UPDATE',
          payload: {
            objectId: current.objectId,
            data,
            notify: true
          }
        });
        form.getFieldInstance('nombre').focus();
      } else {
        const firstFieldWithError = Object.keys(err).pop();
        form.getFieldInstance(firstFieldWithError).focus();
        message.error('Por favor revise todos los campos del formulario', 2.5)
      }
    });
  }


  render() {
    const { updating, objectNotFound, form, location } = this.props
    const { localidades, provincias, loadingLocalidades } = this.state
    const localidadesOpts = localidades.map((l) => <Option key={l.objectId}>{l.nombre}</Option>);
    const provinciasOpts = provincias.map((l) => <Option key={l.objectId}>{l.nombre}</Option>);
    
    if (!location.state || objectNotFound) {
      return <Redirect to="/centros" />
    }
    return (
      <div>
        <Helmet title="Centro Edit" />
        <div className="card">
          {/* <div className="card-header">
            <div className="utils__title">
              <strong>Editar Centro</strong>
            </div>
          </div> */}
          <div className="card-body">
            <h4 className="text-black mb-3">
              <strong>Institución</strong>
            </h4>
            <Form layout="vertical" autoComplete="off">
              <div className="row">
                <div className="col-lg-8">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <FormItem label="Nombre">
                          {form.getFieldDecorator('nombre',{
                            rules: [
                              { required: true, message: 'Por favor ingrese un nombre.', whitespace: true }
                            ],
                          })(<Input placeholder="Escriba el nombre de la institución" />)}
                        </FormItem>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <FormItem label="Email">
                          {form.getFieldDecorator('emailContacto',{
                            rules: [
                              {
                                type: 'email',
                                message: 'Escriba una dirección de E-mail válida.',
                              },
                              {
                                required: true,
                                message: 'Por favór ingrese un email.',
                              },
                            ],
                          })(<Input placeholder="Escriba el e-mail de la institución" />)}
                        </FormItem>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <h4 className="text-black mt-2 mb-3">
                        <strong>Dirección</strong>
                      </h4>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <FormItem label="Calle">
                              {form.getFieldDecorator('calle')(
                                <Input id="centro-edit-calle" placeholder="Escribe la dirección" />
                              )}
                            </FormItem>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <FormItem label="Número">
                              {form.getFieldDecorator('numero')(
                                <InputNumber
                                  id="centro-edit-numero"
                                  placeholder="Escriba el número de la dirección"
                                  style={{ width: '100%'}}
                                />
                              )}
                            </FormItem>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <FormItem label="Provincia">
                              {form.getFieldDecorator('provincia')(
                                <Select
                                  id="centro-edit-provincia"
                                  showSearch
                                  style={{ width: '100%' }}
                                  placeholder="Seleccione una Provincia"
                                  optionFilterProp="children"
                                  notFoundContent={null}
                                  onChange={this.onProvinciaChange}
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  { provinciasOpts }
                                </Select>
                              )}
                            </FormItem>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <FormItem label="Localidad">
                              {form.getFieldDecorator('localidad')(
                                <Select
                                  id="centro-edit-localidad"
                                  showSearch
                                  style={{ width: '100%' }}
                                  placeholder="Seleccione una Localidad"
                                  optionFilterProp="children"
                                  loading={loadingLocalidades}
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  { localidadesOpts }
                                </Select>
                              )}
                            </FormItem>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <h4 className="text-black mt-2 mb-3">
                            <strong>Observaciones</strong>
                          </h4>
                          <div className="form-group">
                            <FormItem>
                              {form.getFieldDecorator('observaciones')(
                                <TextArea rows={6} />
                              )}
                            </FormItem>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-actions">
                            <Button disabled={updating} type="primary" className="mr-2" onClick={this.save}>
                              Editar Centro
                            </Button>
                            <Link to="/centros">
                              <Button type="default">Volver</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default CentroEdit
