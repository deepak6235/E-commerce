import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminOrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTracking = async () => {
          
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login");
        navigate("/");
        return;
      }
      setIsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/shipment/admin/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShipment(res.data);
        
        // Calculate estimated delivery if not delivered
        if (res.data.status !== 'Delivered' && res.data.shipped_at) {
          const shippedDate = new Date(res.data.shipped_at);
          const estimatedDate = new Date(shippedDate);
          estimatedDate.setDate(estimatedDate.getDate() + 3); // 3 days after shipping
          setEstimatedDelivery(estimatedDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          }));
        }
      } catch (err) {
        console.error("Error fetching shipment:", err);
        alert("Failed to load tracking information");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTracking();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing for shipment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '🎁';
      case 'shipped':
        return '🚚';
      case 'preparing for shipment':
        return '📦';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const stages = [
    { 
      label: "Order Confirmed", 
      key: "Order Confirmed",
      description: "Order has been confirmed and payment processed",
      icon: "✅"
    },
    { 
      label: "Preparing for Shipment", 
      key: "Preparing for Shipment",
      description: "Items are being packed and prepared for shipping",
      icon: "📦"
    },
    { 
      label: "Shipped", 
      key: "Shipped",
      description: "Package has been shipped and is in transit",
      icon: "🚚"
    },
    { 
      label: "Out for Delivery", 
      key: "Out for Delivery",
      description: "Package is out for delivery today",
      icon: "🏍️"
    },
    { 
      label: "Delivered", 
      key: "Delivered",
      description: "Package has been delivered successfully",
      icon: "🎁"
    },
  ];

  const currentStageIndex = stages.findIndex(
    (stage) => stage.key === shipment?.status
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="space-y-6">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Tracking Not Available</h3>
            <p className="text-gray-600 mb-8">
              We couldn't find tracking information for this order.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
          
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600">Admin View - Order #{orderId}</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="text-4xl">{getStatusIcon(shipment.status)}</div>
              <div>
                <div className="text-sm font-medium text-gray-500">Current Status</div>
                <div className="text-2xl font-bold text-gray-900">{shipment.status}</div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(shipment.status)}`}>
              {shipment.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Progress</h2>
              
              {/* Timeline */}
              <div className="space-y-6">
                {stages.map((stage, index) => {
                  const isCompleted = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  const isUpcoming = index > currentStageIndex;

                  return (
                    <div key={stage.key} className="flex items-start space-x-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isCurrent 
                            ? 'bg-blue-500 border-blue-500 text-white animate-pulse' 
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {isCompleted ? '✓' : stage.icon}
                        </div>
                        {index < stages.length - 1 && (
                          <div className={`flex-1 w-1 mt-2 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`} style={{ height: '60px' }}></div>
                        )}
                      </div>

                      {/* Stage Details */}
                      <div className={`flex-1 pb-6 ${index < stages.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className={`text-lg font-semibold ${
                          isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {stage.label}
                        </div>
                        <div className={`text-sm mt-1 ${
                          isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {stage.description}
                        </div>
                        
                        {/* Status-specific details */}
                        {isCurrent && shipment.status === 'Shipped' && shipment.shipped_at && (
                          <div className="mt-3 text-sm text-blue-600 bg-blue-50 rounded-lg p-3">
                            <strong>Shipped on:</strong> {new Date(shipment.shipped_at).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                        
                        {isCurrent && shipment.status === 'Delivered' && shipment.delivered_at && (
                          <div className="mt-3 text-sm text-green-600 bg-green-50 rounded-lg p-3">
                            <strong>Delivered on:</strong> {new Date(shipment.delivered_at).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-semibold text-gray-900">#{orderId}</span>
                </div>
                
                {shipment.shipped_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipped Date</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(shipment.shipped_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {shipment.delivered_at ? (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivered Date</span>
                    <span className="font-semibold text-green-600">
                      {new Date(shipment.delivered_at).toLocaleDateString()}
                    </span>
                  </div>
                ) : estimatedDelivery && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Est. Delivery</span>
                    <span className="font-semibold text-blue-600">{estimatedDelivery}</span>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              {/* <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Admin Actions</h4>
                <div className="space-y-2">
                  <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Update Status</span>
                  </button>
                  <button className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>Contact Customer</span>
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.print()}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Tracking Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderTracking;