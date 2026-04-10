import React from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { formatDate } from "../../utils/dateHelpers";
const ActiveLoansModal = ({ activeTab, onClose, books, onReturn, onBorrow }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    {" "}
    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl overflow-hidden flex flex-col">
      {" "}
      <div className="bg-black text-white p-6 flex justify-between items-center">
        {" "}
        <h2 className="text-sm font-black tracking-widest uppercase">{activeTab}</h2>{" "}
        <button onClick={onClose}>
          {" "}
          <X size={24} />{" "}
        </button>{" "}
      </div>{" "}
      <div className="p-6 overflow-y-auto">
        {" "}
        {books.length > 0 ? (
          <div className="grid gap-4">
            {books.map((b) => (
              <div key={b._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 flex-wrap gap-4">
                <div>
                  <p className="font-black text-xs uppercase text-gray-900">{b.book?.title || b.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{b.book?.author || b.author}</p>
                </div>
                <div className="text-right ml-auto">
                  {activeTab === "borrowed" && (
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">DUE: {formatDate(b.dueDate)}</p>
                      <button onClick={() => onReturn(b._id)} className="px-5 py-2 bg-black text-white text-[9px] font-black rounded-xl uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md">
                        Return
                      </button>
                    </div>
                  )}
                  {activeTab === "browse" && (
                    <button
                      onClick={() => onBorrow(b._id)}
                      disabled={b.quantity <= 0}
                      className="px-5 py-2 bg-black text-white text-[9px] font-black rounded-xl uppercase tracking-widest disabled:opacity-30 hover:bg-emerald-600 transition-all shadow-md"
                    >
                      {b.quantity > 0 ? "BORROW" : "OUT OF STOCK"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-px h-12 bg-gray-100 mb-4" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">No Active Records Found</p>
             <p className="text-[8px] font-bold text-gray-300 uppercase mt-2">The system has returned 0 active pointers for this category</p>
          </div>
        )}

      </div>{" "}
    </div>{" "}
  </div>
);
ActiveLoansModal.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  books: PropTypes.array.isRequired,
  onReturn: PropTypes.func.isRequired,
  onBorrow: PropTypes.func.isRequired,
};
export default ActiveLoansModal;
