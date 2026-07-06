import "./buildings-style.css";

export default function Buildings() {
  return (
    <div className="bg-light d-flex align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 p-5 rounded-4">
              <h1 className="text-primary fw-bold mb-3 notice">
                Select a building:
              </h1>

              <select name="buildings" id="buildings" className="form-select">
                <option value="LS">St. La Salle Hall</option>
                <option value="G">John Gokongwei Sr. Hall</option>
                <option value="HS">Henry Sy Sr. Hall</option>
                <option value="Y">Don Enrique T. Yuchencho Hall</option>
                <option value="M">St. Miguel Febres Cordero Hall</option>
                <option value="V">Urbano J. Velasco Hall</option>
                <option value="J">St. Joseph Hall</option>
                <option value="A">Br. Andrew Gonzalez Building</option>
                <option value="ER">Enrique M. Razon Sports Center</option>
              </select>

              <button className="btn btn-primary btn-lg mt-3" id="confi">
                Confirm
              </button>

              <div className="text-center mt-4" id="infodisp">
                <img
                  src=""
                  className="img-fluid rounded border border-success p-1"
                  style={{ maxHeight: "350px", width: "auto" }}
                  alt=""
                  id="bPhoto"
                />

                <p className="text-secondary mt-2 text-center" id="text">
                  Placeholder text for building info
                </p>

                <button className="btn btn-primary btn-lg mt-3" id="clea">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}