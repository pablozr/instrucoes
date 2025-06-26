'use client'

import React from 'react';

interface ListWrapperProps {
  title: string;
  itemCount: number;
  itemNoun: { singular: string, plural: string };
  icon: React.ReactNode;
  emptyState: {
    icon: React.ReactNode;
    title: string;
    message: string;
  };
  children: React.ReactNode;
}

export default function ListWrapper({ title, itemCount, itemNoun, icon, emptyState, children }: ListWrapperProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {itemCount} {itemCount === 1 ? itemNoun.singular : itemNoun.plural}
          </span>
        </div>

        {itemCount === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              {emptyState.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">{emptyState.title}</h3>
            <p className="text-sm text-gray-500">{emptyState.message}</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="space-y-3">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 