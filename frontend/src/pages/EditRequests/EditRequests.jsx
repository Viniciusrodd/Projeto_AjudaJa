
// css
import styles from './EditRequests.module.css';

// hooks
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const EditRequests = () => {
    // states
    const [ data_fields, setData_fields ] = useState({
        title: '', description: '', category: '', urgency: 'baixa', status: 'aberto'
    });

    // consts
    const { requestID } = useParams();

    

    return (
        <div className='container_default'>
            <h1 className='title is-1'>Edite seu pedido de ajuda</h1>

        </div>
    );
};

export default EditRequests;
