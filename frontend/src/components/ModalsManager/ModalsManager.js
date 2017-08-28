import React, {
   Component
} from 'react';
import {
   connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Order from '../Order/Order';
import AlertView from '../AlertView/AlertView';
import * as actions from '../../actionsStore';
import './ModalsManager.less';

class ModalsManager extends Component {

   static propTypes = {
      modals: PropTypes.object
   };

   renderModals() {
      const getByType = (type) => {
         switch (type) {
            case 'order':
               return Order;
            case 'alert':
               return AlertView;
            default:
               return <div></div>;
         }
      },
      modals = this.props.modals,
      closeModal = this.props.closeModal,
      keys = Object.keys(modals),
      last = keys.length - 1;
      return keys.map((key, num) => {
         const item = modals[key];
         item.key = key;
         item.blured = last !== num;
         item.close = closeModal.bind(null, key);
         item.component = getByType(modals[key].type);
         return (
            <Modal
               className={'ModalsManager__modal' + (item.blured ? ' ModalsManager__modal--blured' : '')}
               key={item.key}
               isOpen={ true }
               onRequestClose={item.close}
               contentLabel={item.type}>
               <item.component
                  id={item.id}
                  data={item.data}
                  close={item.close} />
            </Modal>
         );
      });
   }

   render() {
      return (
         <div className='ModalsManager'>
            {this.renderModals()}
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => ({
   modals: state.modal.active,
   modalsCount: Object.keys(state.modal.active).length
});

export default ModalsManager = connect(mapStateToProps, actions)(ModalsManager);