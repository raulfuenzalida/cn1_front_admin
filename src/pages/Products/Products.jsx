import { useEffect, useState } from 'react';
import {
  createProduct,
  getProducts,
  recalculateProductPrice,
  updateProduct,
  updateProductStatus,
} from '../../services/productService';
import { getFilaments } from '../../services/configService';

const initialForm = {
  name: '',
  description: '',
  idFilament: '',
  filamentGrams: '',
  printingHours: '',
  profitPercentage: '',
};

function Products() {
  const [products, setProducts] = useState([]);
  const [filaments, setFilaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [statusError, setStatusError] = useState('');

  const [recalculatingId, setRecalculatingId] = useState(null);
  const [recalculateError, setRecalculateError] = useState('');

  const loadProducts = async () => {
    const response = await getProducts();
    setProducts(response?.content ?? []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [productsResponse, filamentsResponse] = await Promise.all([
          getProducts(),
          getFilaments(),
        ]);

        setProducts(productsResponse?.content ?? []);

        setFilaments(
          Array.isArray(filamentsResponse)
            ? filamentsResponse
            : filamentsResponse?.content ?? []
        );
      } catch (err) {
        console.error('Error al cargar datos de productos:', err);

        setError(
          err?.message ||
            'No fue posible obtener los productos o filamentos.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const resetProductForm = () => {
    setFormData(initialForm);
    setEditingProductId(null);
    setFormError('');
    setShowProductForm(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleNewProduct = () => {
    if (showProductForm && editingProductId === null) {
      resetProductForm();
      return;
    }

    setEditingProductId(null);
    setFormData(initialForm);
    setFormError('');
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);

    setFormData({
      name: product.name ?? '',
      description: product.description ?? '',
      idFilament:
        product.idFilament != null
          ? String(product.idFilament)
          : '',
      filamentGrams:
        product.filamentGrams != null
          ? String(product.filamentGrams)
          : '',
      printingHours:
        product.printingHours != null
          ? String(product.printingHours)
          : '',
      profitPercentage:
        product.profitPercentage != null
          ? String(product.profitPercentage)
          : '',
    });

    setFormError('');
    setShowProductForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();

    setFormError('');

    if (
      !formData.name.trim() ||
      !formData.idFilament ||
      !formData.filamentGrams ||
      !formData.printingHours ||
      formData.profitPercentage === ''
    ) {
      setFormError('Completa todos los campos obligatorios.');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      idFilament: Number(formData.idFilament),
      filamentGrams: Number(formData.filamentGrams),
      printingHours: Number(formData.printingHours),
      profitPercentage: Number(formData.profitPercentage),
    };

    try {
      setSaving(true);

      if (editingProductId !== null) {
        await updateProduct(
          editingProductId,
          productData
        );
      } else {
        await createProduct(productData);
      }

      await loadProducts();

      resetProductForm();
    } catch (err) {
      console.error(
        editingProductId !== null
          ? 'Error al editar producto:'
          : 'Error al crear producto:',
        err
      );

      setFormError(
        err?.message ||
          (editingProductId !== null
            ? 'No fue posible actualizar el producto.'
            : 'No fue posible crear el producto.')
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleProductStatus = async (product) => {
    const newStatus =
      product.status === 'ACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE';

    try {
      setUpdatingStatusId(product.id);
      setStatusError('');

      await updateProductStatus(
        product.id,
        newStatus
      );

      await loadProducts();
    } catch (err) {
      console.error(
        'Error al actualizar estado del producto:',
        err
      );

      setStatusError(
        err?.message ||
          'No fue posible actualizar el estado del producto.'
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleRecalculateProduct = async (product) => {
    try {
      setRecalculatingId(product.id);
      setRecalculateError('');

      await recalculateProductPrice(product.id);

      await loadProducts();
    } catch (err) {
      console.error(
        'Error al recalcular precio del producto:',
        err
      );

      setRecalculateError(
        err?.message ||
          'No fue posible recalcular el precio del producto.'
      );
    } finally {
      setRecalculatingId(null);
    }
  };

  const getFilamentName = (idFilament) => {
    const filament = filaments.find(
      (item) => Number(item.id) === Number(idFilament)
    );

    return filament
      ? filament.name
      : `#${idFilament}`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2>Productos</h2>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2>Productos</h2>

        <div className="alert alert-danger" role="alert">
          <strong>Error al cargar productos:</strong> {error}
        </div>
      </div>
    );
  }

  const activeFilaments = filaments.filter(
    (filament) => filament.status === 'ACTIVE'
  );

  const availableFilaments = filaments.filter(
    (filament) =>
      filament.status === 'ACTIVE' ||
      Number(filament.id) === Number(formData.idFilament)
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Productos</h2>

          <p className="text-muted mb-0">
            Productos registrados en PrintWorks
          </p>
        </div>

        <button
          type="button"
          className={
            showProductForm
              ? 'btn btn-secondary'
              : 'btn btn-primary'
          }
          onClick={
            showProductForm
              ? resetProductForm
              : handleNewProduct
          }
          disabled={saving}
        >
          {showProductForm
            ? 'Cancelar'
            : '+ Nuevo producto'}
        </button>
      </div>

      {showProductForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editingProductId !== null
                ? 'Editar producto'
                : 'Nuevo producto'}
            </h5>

            <form onSubmit={handleSaveProduct}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="productName"
                    className="form-label"
                  >
                    Nombre *
                  </label>

                  <input
                    id="productName"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Ej: Soporte para celular"
                    value={formData.name}
                    onChange={handleFormChange}
                    disabled={saving}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="productFilament"
                    className="form-label"
                  >
                    Filamento *
                  </label>

                  <select
                    id="productFilament"
                    name="idFilament"
                    className="form-select"
                    value={formData.idFilament}
                    onChange={handleFormChange}
                    disabled={saving}
                    required
                  >
                    <option value="" disabled>
                      Selecciona un filamento
                    </option>

                    {availableFilaments.map((filament) => (
                      <option
                        key={filament.id}
                        value={filament.id}
                      >
                        {filament.name}
                        {filament.status !== 'ACTIVE'
                          ? ' (inactivo)'
                          : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label
                    htmlFor="productDescription"
                    className="form-label"
                  >
                    Descripción
                  </label>

                  <textarea
                    id="productDescription"
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Descripción del producto"
                    value={formData.description}
                    onChange={handleFormChange}
                    disabled={saving}
                  />
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="filamentGrams"
                    className="form-label"
                  >
                    Filamento utilizado (g) *
                  </label>

                  <input
                    id="filamentGrams"
                    name="filamentGrams"
                    type="number"
                    className="form-control"
                    min="0.01"
                    step="0.01"
                    placeholder="Ej: 120"
                    value={formData.filamentGrams}
                    onChange={handleFormChange}
                    disabled={saving}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="printingHours"
                    className="form-label"
                  >
                    Horas de impresión *
                  </label>

                  <input
                    id="printingHours"
                    name="printingHours"
                    type="number"
                    className="form-control"
                    min="0.01"
                    step="0.01"
                    placeholder="Ej: 4"
                    value={formData.printingHours}
                    onChange={handleFormChange}
                    disabled={saving}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="profitPercentage"
                    className="form-label"
                  >
                    Margen de ganancia (%) *
                  </label>

                  <input
                    id="profitPercentage"
                    name="profitPercentage"
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 50"
                    value={formData.profitPercentage}
                    onChange={handleFormChange}
                    disabled={saving}
                    required
                  />
                </div>
              </div>

              {activeFilaments.length === 0 &&
                editingProductId === null && (
                  <div className="alert alert-warning mt-3 mb-0">
                    No existen filamentos activos. Debes registrar o
                    activar un filamento desde Configuración antes de
                    crear un producto.
                  </div>
                )}

              {formError && (
                <div
                  className="alert alert-danger mt-3 mb-0"
                  role="alert"
                >
                  <strong>Error:</strong> {formError}
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetProductForm}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    saving ||
                    (
                      editingProductId === null &&
                      activeFilaments.length === 0
                    )
                  }
                >
                  {saving
                    ? 'Guardando...'
                    : editingProductId !== null
                      ? 'Guardar cambios'
                      : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statusError && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          <strong>Error:</strong> {statusError}
        </div>
      )}

      {recalculateError && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          <strong>Error al recalcular:</strong>{' '}
          {recalculateError}
        </div>
      )}

      {products.length === 0 ? (
        <div className="alert alert-info">
          No existen productos registrados.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Filamento</th>
                <th>Gramos</th>
                <th>Horas</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Precio actualizado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const updating =
                  updatingStatusId === product.id;

                const recalculating =
                  recalculatingId === product.id;

                return (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>
                      {getFilamentName(product.idFilament)}
                    </td>

                    <td>
                      {product.filamentGrams} g
                    </td>

                    <td>
                      {product.printingHours} h
                    </td>

                    <td>
                      {product.price?.finalPrice != null
                        ? `$${Number(
                            product.price.finalPrice
                          ).toLocaleString('es-CL')}`
                        : '-'}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          product.status === 'ACTIVE'
                            ? 'text-bg-success'
                            : 'text-bg-secondary'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          product.priceStatus === 'CURRENT'
                            ? 'text-bg-success'
                            : 'text-bg-warning'
                        }`}
                      >
                        {product.priceStatus}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            handleEditProduct(product)
                          }
                          disabled={
                            updating ||
                            recalculating ||
                            saving
                          }
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className={
                            product.status === 'ACTIVE'
                              ? 'btn btn-sm btn-outline-secondary'
                              : 'btn btn-sm btn-outline-success'
                          }
                          onClick={() =>
                            handleToggleProductStatus(product)
                          }
                          disabled={
                            updating ||
                            recalculating ||
                            saving
                          }
                        >
                          {updating
                            ? 'Actualizando...'
                            : product.status === 'ACTIVE'
                              ? 'Desactivar'
                              : 'Activar'}
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() =>
                            handleRecalculateProduct(product)
                          }
                          disabled={
                            updating ||
                            recalculating ||
                            saving
                          }
                        >
                          {recalculating
                            ? 'Recalculando...'
                            : 'Recalcular'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Products;