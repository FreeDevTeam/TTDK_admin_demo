import React, { useState, useEffect, memo } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Progress } from 'reactstrap';
import { injectIntl } from 'react-intl';

function LoadingDialog(props) {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const {
        onExportListCustomers,
        title
    } = props
    useEffect(() => {
        let timeoutId;
        if (isDialogVisible) {
            timeoutId = setTimeout(() => {
                setIsDialogVisible(false);
                onExportListCustomers()
            }, 4000);
        }
        return () => clearTimeout(timeoutId);
    }, [isDialogVisible]);

    return (
        <>
            {/* Dialog Activator */}
            <Button
                disabled={isDialogVisible}
                onClick={() => setIsDialogVisible(true)}
            >
                {title}
            </Button>

            {/* Dialog */}
            <Modal
                isOpen={isDialogVisible}
                toggle={() => setIsDialogVisible(false)}
                size="sm"
            >
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <Progress animated color="primary" value={100} />
                </ModalBody>
            </Modal>
        </>
    );
}

export default injectIntl(memo(LoadingDialog))
