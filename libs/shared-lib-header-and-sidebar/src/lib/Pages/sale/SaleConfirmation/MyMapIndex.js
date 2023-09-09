import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DraggableMarker from "../../../components/map/DraggableMarker";
import axios from "axios";
import { Button, Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../../components/map/style.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function MyMapIndex({
  disabled = false,
  defaultLoc = {},
  setAddressLoading = false,
  getMapData,
}) {
  const [currentPos, setCurrentPos] = useState({});
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 0,
  };

  function sendMapData() {
    if (Object.keys(currentPos).length) {
      setAddressLoading(true);
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${currentPos?.lat}&lon=${currentPos?.lng}&accept-language=fa`
        )
        .then((res) => {
          let country = res?.data?.address?.country;
          let city = res?.data?.address?.city
            ? "،" + res?.data?.address?.city
            : "";
          let state = res?.data?.address?.state
            ? "،" + res?.data?.address?.state
            : "";
          let road = res?.data?.address?.road
            ? "،" + res?.data?.address?.road
            : "";
          let fullAddress = `${country} ${state} ${city} ${road}`;
          getMapData(fullAddress, currentPos);
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setAddressLoading(false);
        });
    }
    handleClose();
  }

  return (
    <>
      <Button
        disabled={disabled}
        onClick={handleOpen}
        variant="outlined"
        color="primary"
        style={{ fontSize: "10px", whiteSpace: "no-wrap" }}
      >
      {t("تایید/رد")}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            className={`modal-header ${
              i18n.dir() == "ltr" ? "header-ltr" : ""
            }`}
          >
            <h2>{t("نمایش روی نقشه")}</h2>
            <button type="button" className="close-btn" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="map-modal-content">
            <MapContainer
              center={
                Object.keys(defaultLoc).length
                  ? [defaultLoc?.lat, defaultLoc?.lng]
                  : [35.69958174823983, 51.338381767272956]
              }
              zoom={15}
              style={{ height: "70vh", width: "70vw" }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <DraggableMarker
                setCurrentPos={setCurrentPos}
                defaultLoc={defaultLoc}
              />
            </MapContainer>
          </div>
          <div
            className="d-flex align-items-center justify-content-center pb-3"
            style={{ direction: i18n.dir() }}
          >
            <Button variant="contained" color="success" onClick={sendMapData}>
              {t("تایید")}
            </Button>

            <Button
              variant="contained"
              sx={
                i18n.dir() === "rtl"
                  ? { marginRight: "10px" }
                  : { marginLeft: "10px" }
              }
              color="error"
            >
              <Link to={`/Sell/saleConfirmation/Sharing`}> {t("رد")}</Link>
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default MyMapIndex;
