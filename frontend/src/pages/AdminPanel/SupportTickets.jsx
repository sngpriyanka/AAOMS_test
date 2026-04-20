import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMessageCircle, FiUser, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function SupportTickets() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const mockTickets = [
        {
          id: 1,
          ticketNumber: 'TKT-001',
          customer: 'Krishna Magar',
          email: 'krishna@example.com',
          subject: 'Product not received',
          message: 'I ordered a dress 2 weeks ago but haven\'t received it yet.',
          status: 'open',
          priority: 'high',
          createdAt: '2026-04-12 10:30:00',
          updatedAt: '2026-04-14 09:00:00',
          replies: [
            { sender: 'admin1', message: 'We will investigate this immediately.', timestamp: '2026-04-12 11:15:00' }
          ]
        },
        {
          id: 2,
          ticketNumber: 'TKT-002',
          customer: 'Priya Verma',
          email: 'priya@example.com',
          subject: 'Payment issue',
          message: 'My card was charged twice for the same order.',
          status: 'in-progress',
          priority: 'high',
          createdAt: '2026-04-13 14:20:00',
          updatedAt: '2026-04-14 08:30:00',
          replies: [
            { sender: 'admin2', message: 'Please provide your order ID.', timestamp: '2026-04-13 15:00:00' },
            { sender: 'customer', message: 'Order ID: #12345', timestamp: '2026-04-13 16:00:00' }
          ]
        },
        {
          id: 3,
          ticketNumber: 'TKT-003',
          customer: 'Rajesh Patel',
          email: 'rajesh@example.com',
          subject: 'Size doesn\'t fit',
          message: 'The dress I received is the wrong size. Need a refund or exchange.',
          status: 'resolved',
          priority: 'medium',
          createdAt: '2026-04-10 09:15:00',
          updatedAt: '2026-04-12 13:45:00',
          replies: [
            { sender: 'admin1', message: 'We will process the return.', timestamp: '2026-04-10 10:30:00' },
            { sender: 'customer', message: 'Thank you!', timestamp: '2026-04-10 11:00:00' }
          ]
        },
        {
          id: 4,
          ticketNumber: 'TKT-004',
          customer: 'Ananya Gupta',
          email: 'ananya@example.com',
          subject: 'Account access issue',
          message: 'Cannot login to my account. Getting an error message.',
          status: 'open',
          priority: 'medium',
          createdAt: '2026-04-14 08:00:00',
          updatedAt: '2026-04-14 08:00:00',
          replies: []
        },
      ];
      setTickets(mockTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    setSelectedTicket(tickets.find(t => t.id === ticketId) && { ...selectedTicket, status: newStatus });
  };

  const sendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          replies: [...t.replies, { sender: user?.name, message: replyMessage, timestamp: new Date().toLocaleString() }]
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id));
    setReplyMessage('');
  };

  const getFilteredTickets = () => {
    if (filterStatus === 'all') return tickets;
    return tickets.filter(t => t.status === filterStatus);
  };

  const getStatusColor = (status) => {
    const colors = { open: '#F44336', 'in-progress': '#FF9800', resolved: '#4CAF50' };
    return colors[status] || '#666';
  };

  const getPriorityColor = (priority) => {
    const colors = { high: '#F44336', medium: '#FF9800', low: '#4CAF50' };
    return colors[priority] || '#666';
  };

  const filteredTickets = getFilteredTickets();

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>Support Tickets</h1>
        <p>Manage customer support requests</p>
      </div>

      {loading ? (
        <div className="loading">Loading support tickets...</div>
      ) : (
        <div className="support-container">
          {/* Tickets List */}
          <div className="tickets-list">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All ({tickets.length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'open' ? 'active' : ''}`}
                onClick={() => setFilterStatus('open')}
              >
                Open ({tickets.filter(t => t.status === 'open').length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
                onClick={() => setFilterStatus('in-progress')}
              >
                In Progress ({tickets.filter(t => t.status === 'in-progress').length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'resolved' ? 'active' : ''}`}
                onClick={() => setFilterStatus('resolved')}
              >
                Resolved ({tickets.filter(t => t.status === 'resolved').length})
              </button>
            </div>

            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`ticket-card ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ticket-header">
                  <div>
                    <h4>{ticket.ticketNumber}</h4>
                    <p>{ticket.subject}</p>
                  </div>
                  <div className="ticket-badges">
                    <span className="badge" style={{ backgroundColor: getStatusColor(ticket.status) }}>
                      {ticket.status}
                    </span>
                    <span className="badge" style={{ backgroundColor: getPriorityColor(ticket.priority) }}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
                <div className="ticket-info">
                  <span><FiUser size={14} /> {ticket.customer}</span>
                  <span><FiCalendar size={14} /> {ticket.createdAt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Detail */}
          {selectedTicket ? (
            <div className="ticket-detail">
              <div className="detail-header">
                <h2>{selectedTicket.ticketNumber} - {selectedTicket.subject}</h2>
                <div className="detail-actions">
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="detail-content">
                <div className="customer-info">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedTicket.customer}</p>
                  <p><strong>Email:</strong> {selectedTicket.email}</p>
                  <p><strong>Created:</strong> {selectedTicket.createdAt}</p>
                </div>

                <div className="ticket-message">
                  <h4>Issue Description</h4>
                  <p>{selectedTicket.message}</p>
                </div>

                {/* Replies */}
                <div className="conversation">
                  <h4><FiMessageCircle /> Conversation</h4>
                  <div className="messages">
                    {selectedTicket.replies.length > 0 ? (
                      selectedTicket.replies.map((reply, idx) => (
                        <div key={idx} className={`message ${reply.sender === user?.name ? 'admin' : 'customer'}`}>
                          <strong>{reply.sender}</strong>
                          <p>{reply.message}</p>
                          <small>{reply.timestamp}</small>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center', color: '#999' }}>No replies yet</p>
                    )}
                  </div>

                  {/* Reply Form */}
                  {selectedTicket.status !== 'resolved' && (
                    <div className="reply-form">
                      <textarea 
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        rows="4"
                      />
                      <button className="action-btn" onClick={sendReply}>
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="ticket-detail empty">
              <p>Select a ticket to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SupportTickets;
