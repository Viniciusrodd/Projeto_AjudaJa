
// css
import styles from './EditRequests.module.css';

// hooks
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const EditRequests = () => {
    const { requestID } = useParams();
    const [ data_fields, setData_fields ] = useState({
        id: 0, title: '', description: '', category: '', urgency: ''
    });


    return (
        <div className='container_default'>
            <h1 className='title is-1'>Edite seu pedido de ajuda</h1>
            
        </div>
    );
};

export default EditRequests;
