'use client';

export const Chat = () => {
    return (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
            <h3 style={{ margin: '0 0 5px 0', flexShrink: 0 }}>Chat</h3>
            <div style={{ border: '1px solid lightgray', flex: 1, overflowY: 'auto', marginBottom: '8px', fontSize: '12px', padding: '5px', backgroundColor: '#fafafa' }}>
                <p><strong>System:</strong> Welcome to Fortune!</p>
            </div>
            <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                <input type="text" style={{ flex: 1, border: '1px solid black', padding: '2px 5px', minWidth: 0 }} placeholder="msg" />
                <button style={{ border: '1px solid black', padding: '2px 10px', cursor: 'pointer', flexShrink: 0 }}>Send</button>
            </div>
        </div>
    );
};
