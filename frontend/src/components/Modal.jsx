
const Modal = ({title, msg, btt1, btt2, display, title_color, onClose}) => {    
    return (
        <div>
            { /* Modal */ }
            <div className='modal' style={{ display: display ? 'flex' : 'none' }}>
            <div className='modal-background'></div>
                <div className='modal-card'>
                    <header className='modal-card-head'>
                        <p className='modal_title modal-card-title has-text-centered' 
                        style={{ textAlign:'center', color: title_color }}>
                            { title }
                        </p>
                    </header>
                    <section className='modal-card-body'>
                        <p className='modal-card-title has-text-centered' style={{ textAlign:'center' }}>
                            {msg?.split('\n').map((line, idx) => (
                                <span className='modal_span' key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </p>
                    </section>
                    <footer className='modal-card-foot is-justify-content-center'>
                        <div className='div-buttons'>
                            {btt1 && (
                                <button className="button is-danger is-dark">
                                    { btt1 }
                                </button>
                            )}
                            {btt2 && (
                                <button onClick={ onClose } className="button is-primary is-dark" 
                                style={{ marginLeft:'10px' }}>
                                    { btt2 }
                                </button>
                            )}
                        </div>
                    </footer>
                </div>
            </div>            
        </div>
    );
};

export default Modal;
