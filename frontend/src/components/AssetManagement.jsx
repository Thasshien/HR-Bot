import React from 'react'

const AssetManagement = ({assetMovements}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Asset Movement</h2>
            <div className="grid gap-4">
                {assetMovements.length > 0 ? (
                    assetMovements.map((asset, index) => (
                        <div key={asset.name || index} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Asset ID: {asset.asset_id || asset.name}</h3>
                                </div>

                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-sm text-orange-900">Reference Doctype</div>
                                    <div className="text-lg font-semibold text-orange-900">{asset.reference_doctype || "N/A"}</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-sm text-purple-900">Reference Name</div>
                                    <div className="text-lg font-semibold text-purple-900">{asset.reference_name || "N/A"}</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-sm text-blue-900">Transaction Date</div>
                                    <div className="text-lg font-semibold text-blue-900">
                                        {asset.transaction_date ? new Date(asset.transaction_date).toLocaleString() : "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No asset movements found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AssetManagement
