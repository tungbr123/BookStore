"use client";

import { useEffect, useState } from "react";
import api from "@/ApiProcess/api";
import { useSelector } from "react-redux";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const loggedUser = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get(`voucher/${loggedUser.userid}`);
        const data = await response.data.data;
        setVouchers(data);
        setFilteredVouchers(data); // Set initial filtered vouchers
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [loggedUser.userid]);

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === "all") {
      setFilteredVouchers(vouchers);
    } else {
      setFilteredVouchers(vouchers.filter(voucher => voucher.status === status));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="voucher-container">
      <h1 className="page-title">Your Vouchers</h1>

      {/* Filter Options */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "active" ? "active" : ""}`}
          onClick={() => handleFilterChange("active")}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === "expired" ? "active" : ""}`}
          onClick={() => handleFilterChange("expired")}
        >
          Expired
        </button>
        <button
          className={`filter-btn ${filter === "used" ? "active" : ""}`}
          onClick={() => handleFilterChange("used")}
        >
          Used
        </button>
      </div>

      {/* Voucher Cards */}
      <div className="voucher-grid">
        {filteredVouchers.map((voucher) => (
          <div key={voucher.id} className="voucher-card">
            <img
              src={voucher.image_voucher}
              alt="Voucher"
              className="voucher-img"
            />
            <div className="voucher-details">
              <p className="voucher-discount">
                {voucher.discount_value > 1
                  ? `${voucher.discount_value}đ`
                  : `${voucher.discount_value * 100}%`}
              </p>
              <p className="voucher-min-order">
                Min Order: {voucher.min_order_value}đ
              </p>
              <p className="voucher-end-date">
                End Date: {voucher.end_date}
              </p>
              <p className={`voucher-status ${voucher.status}`}>
                Status: {voucher.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .voucher-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-title {
          font-size: 2rem;
          margin-bottom: 20px;
          text-align: center;
        }
        .filter-bar {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .filter-btn {
          background-color: #f0f0f0;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .filter-btn.active {
          background-color: #4caf50;
          color: white;
        }
        .voucher-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .voucher-card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s;
        }
        .voucher-card:hover {
          transform: translateY(-10px);
        }
        .voucher-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .voucher-details {
          padding: 20px;
          text-align: center;
        }
        .voucher-discount,
        .voucher-min-order,
        .voucher-end-date {
          font-size: 1.2rem;
          margin: 8px 0;
        }
        .voucher-status {
          font-size: 1.1rem;
          font-weight: bold;
        }
        .voucher-status.active {
          color: green;
        }
        .voucher-status.expired {
          color: red;
        }
        .voucher-status.used {
          color: gray;
        }
      `}</style>
    </div>
  );
};

export default VoucherPage;
