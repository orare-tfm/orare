"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../../../components/layout/Layout";

const Detail = () => {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get("event");
  const eventDetail = eventParam ? JSON.parse(eventParam) : null;

  if (!eventDetail) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="hero bg-gray-100 min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          <img
            src={eventDetail.url}
            alt={eventDetail.title}
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold">Event!</h1>
            <p className="py-6">{eventDetail.title}</p>
            <button className="btn btn-accent">Subscribe!</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;
