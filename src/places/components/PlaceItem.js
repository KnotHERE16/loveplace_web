import React, { useState ,useContext} from "react";

import "./PlaceItems.css";
import Card from "../../shared/components/UIElement/Card/Card";
import Button from "../../shared/components/formUI/Button";
import "../../shared/components/formUI/Button.css";
import Modal from "../../shared/components/UIElement/Modal";
import Map from "../../shared/components/UIElement/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
const PlaceItem = (props) => {
  const {isLoading,errorMsg,sendRequest,clearError} = useHttpClient();
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openModalMap = () => setShowMap(true);

  const closeModalMap = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
   
    try{
    const responseData =await sendRequest(`${process.env.REACT_APP_BASE_URL}api/places/${props.id}`,'DELETE');
    if(responseData.statusCode === 200){
    props.onDelete(props.id);
    }
    }catch (e){}
  
  };
 
  return (
    <React.Fragment>
      <ErrorModal error={errorMsg} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeModalMap}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeModalMap}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure"
        footerClass="place_item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              CONFIRM
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to prceed and deleted this place? </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && (<LoadingSpinner asOverlay/>)}
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_BASE_URL}${props.image}`} alt={props.title} />
          </div>

          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openModalMap}>
              View On Map
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button onClick={showDeleteWarningHandler} danger>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
