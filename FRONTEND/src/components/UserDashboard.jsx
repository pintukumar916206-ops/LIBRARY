import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

import {
  fetchMyBorrowedBooks,
  returnBorrowedBook,
  recordBorrowedBook,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import Header from "../layout/Header";
import { toast } from "react-toastify";

import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import background from "../assets/background.jpg";
import avatarImage from "../assets/PINTU_KUMAR_.jpg";

import { X } from "lucide-react";
import { List } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
);

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const {
    userBorrowedBooks,
    error: borrowError,
    message: borrowMessage,
  } = useSelector((state) => state.borrow);
  const { books: allBooks } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(fetchMyBorrowedBooks());
    dispatch(fetchAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (borrowMessage) {
      toast.success(borrowMessage);
      dispatch(resetBorrowSlice());
    }
    if (borrowError) {
      toast.error(borrowError);
      dispatch(resetBorrowSlice());
    }
  }, [borrowMessage, borrowError, dispatch]);

  useEffect(() => {
    if (activeTab === "browse") {
      dispatch(fetchAllBooks());
    }
  }, [activeTab, dispatch]);

  const handleReturn = (borrowId) => {
    dispatch(returnBorrowedBook({ email: user.email, bookId: borrowId })).then(
      () => {
        dispatch(fetchMyBorrowedBooks());
      },
    );
  };

  const handleHire = (bookId) => {
    dispatch(recordBorrowedBook({ email: user.email, bookId: bookId })).then(
      () => {
        dispatch(fetchMyBorrowedBooks());
        dispatch(fetchAllBooks());
      },
    );
  };

  // Derived Stats
  const stats = useMemo(() => {
    const safeBooks = userBorrowedBooks || [];
    return {
      borrowed: safeBooks.filter((book) => book.returned === false).length,
      returned: safeBooks.filter((book) => book.returned === true).length,
    };
  }, [userBorrowedBooks]);

  const chartData = useMemo(() => {
    const totalBooks = allBooks?.length || 0;
    const hasData = stats.borrowed > 0 || totalBooks > 0;
    return {
      labels: hasData ? ["Borrowed Books", "No. of Books"] : ["NO DATA"],
      datasets: [
        {
          label: "Books",
          data: hasData ? [stats.borrowed, totalBooks] : [1],
          backgroundColor: hasData ? ["#3D3E3E", "#151619"] : ["#E5E7EB"],
          borderWidth: hasData ? 1 : 0,
        },
      ],
    };
  }, [stats.borrowed, allBooks]);

  const filteredBooks = useMemo(() => {
    if (activeTab === "borrowed") {
      return userBorrowedBooks.filter((book) => book.returned === false);
    }
    if (activeTab === "returned") {
      return userBorrowedBooks.filter((book) => book.returned === true);
    }
    if (activeTab === "browse") {
      return allBooks || [];
    }
    return [];
  }, [activeTab, userBorrowedBooks, allBooks]);

  return (
    <>
      <main
        className="relative w-full p-4 pt-24 lg:pt-20 bg-[#f8f9fa] 
      transition-all duration-300 font-sans h-auto min-h-screen xl:h-screen flex flex-col xl:overflow-hidden"
      >
        <Header />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-2 flex-1 h-auto xl:min-h-0">
          {/* COLUMN 1: PIE CHART */}
          <div className="flex flex-col h-full">
            <div
              className="bg-white p-4 rounded-2xl shadow-lg h-full flex 
                flex-col justify-center items-center 
                w-full border-2 border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">
                ACTIVITY STATISTICS
              </h3>
              <div
                className="w-full flex justify-center items-center 
              flex-1 min-h-[200px] relative h-[250px]"
              >
                <Pie
                  data={chartData}
                  options={{
                    cutout: 0,
                    maintainAspectRatio: false,
                  }}
                  className="w-full max-h-[250px]"
                />
              </div>
            </div>
          </div>

          {/* COLUMN 2: STATS LIST */}
          <div className="flex flex-col gap-4 h-full justify-center">
            {/* BORROWED BOOKS LIST ITEM */}
            <div
              onClick={() => setActiveTab("borrowed")}
              className={`bg-white p-5 rounded-2xl shadow-sm border-2 
                border-gray-200 hover:shadow-lg hover:border-black/10 
                transition-all duration-300 group cursor-pointer flex 
                items-center justify-between
                ${activeTab === "borrowed" ? "ring-2 ring-black" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 bg-indigo-50 rounded-xl 
                    group-hover:bg-indigo-100 
                    transition-colors duration-300"
                >
                  <img src={bookIcon} alt="borrowed" className="w-6 h-6" />
                </div>
                <h3
                  className="text-gray-600 font-bold text-sm tracking-wide 
                uppercase"
                >
                  Borrowed Books
                </h3>
              </div>
              <span className="text-3xl font-black text-gray-800">
                {stats.borrowed}
              </span>
            </div>

            {/* TOTAL BOOKS LIST ITEM */}
            <div
              onClick={() => setActiveTab("browse")}
              className={`bg-white p-5 rounded-2xl shadow-sm border-2 
                border-gray-200 hover:shadow-lg hover:border-black/10 
                transition-all duration-300 group cursor-pointer flex 
                items-center justify-between
                ${activeTab === "browse" ? "ring-2 ring-black" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 bg-orange-50 rounded-xl 
                    group-hover:bg-orange-100 
                    transition-colors duration-300"
                >
                  <img src={browseIcon} alt="total" className="w-6 h-6" />
                </div>
                <h3
                  className="text-gray-600 font-bold text-sm tracking-wide 
                uppercase"
                >
                  Total Books
                </h3>
              </div>
              <span className="text-3xl font-black text-gray-800">
                {allBooks?.length || 0}
              </span>
            </div>
          </div>

          {/* COLUMN 3: PROFILE CARD */}
          <div className="flex flex-col h-full">
            <div
              className="group flex items-center justify-center w-full 
            mx-auto h-full bg-white p-5 rounded-2xl shadow-sm border-2 
            border-gray-200 relative overflow-hidden hover:shadow-xl 
            transition-all duration-300"
            >
              <div
                className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b 
              from-gray-50 to-transparent"
              ></div>

              <div
                className="flex flex-col justify-center items-center gap-6 w-full 
              relative z-10"
              >
                <div className="relative">
                  <div className="p-1 bg-white rounded-full shadow-lg border-[3px] border-gray-200">
                    <img
                      src={user?.avatar?.url || avatarImage}
                      alt="avatar"
                      className="rounded-full w-40 h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-green-500 w-5 h-5 border-4 border-white rounded-full"></div>
                </div>

                <div className="text-center w-full">
                  <span className="inline-block px-4 py-1 rounded-full bg-black text-white text-[10px] font-bold tracking-widest uppercase mb-3 shadow-md">
                    {user?.role || "USER"}
                  </span>
                  <h2 className="text-2xl 2xl:text-3xl font-black text-gray-800 mb-1">
                    {user && user.name}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium mb-6">
                    {user?.email || "user@example.com"}
                  </p>

                  <div
                    className="grid grid-cols-2 gap-4 w-full 
                  border-t border-gray-100 pt-6"
                  >
                    <div
                      className="text-center group-hover:bg-gray-50 
                    rounded-lg p-2 transition-colors"
                    >
                      <p
                        className="text-[10px] text-gray-400 font-bold 
                      uppercase tracking-wider"
                      >
                        STATUS
                      </p>
                      <p className="text-black font-bold text-sm">ACTIVE</p>
                    </div>
                    <div
                      className="text-center border-l border-gray-100 
                    group-hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                      <p
                        className="text-[10px] text-gray-400 font-bold 
                      uppercase tracking-wider"
                      >
                        JOINED
                      </p>
                      <p className="text-black font-bold text-sm">
                        {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL POPUP */}
        {activeTab && (
          <div
            className="fixed inset-0 z-50 flex items-center 
          justify-center bg-black/50 backdrop-blur-sm animation-fade-in-up p-4"
          >
            <div
              className="bg-white w-full max-w-4xl max-h-[80vh] 
            rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* MODAL HEADER */}
              <div
                className="bg-gray-900 text-white p-6 flex justify-between 
              items-center shrink-0"
              >
                <h2 className="text-2xl font-bold uppercase tracking-widest">
                  {activeTab === "borrowed"
                    ? "Active Loans"
                    : activeTab === "returned"
                      ? "Reading History"
                      : "Library Catalog"}
                </h2>
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 h-full flex-1 overflow-hidden">
                {filteredBooks.length > 0 ? (
                  <div className="h-full w-full">
                    {/* TABLE HEADER - STATIC */}
                    <div className="w-full grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-bold">
                      <div className="col-span-5">Book Details</div>
                      {activeTab !== "browse" && (
                        <>
                          <div className="col-span-4">Dates</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-1 text-right">Action</div>
                        </>
                      )}
                      {activeTab === "browse" && (
                        <div className="col-span-5">Availability</div>
                      )}
                      {activeTab === "browse" && (
                        <div className="col-span-2 text-right">Action</div>
                      )}
                    </div>

                    {/* VIRTUALIZED ROWS */}
                    <div className="flex-1 h-[calc(100%-40px)]">
                      <AutoSizer>
                        {({ height, width }) => (
                          <List
                            height={height}
                            itemCount={filteredBooks.length}
                            rowHeight={80}
                            width={width}
                            className="custom-scrollbar"
                          >
                            {({ index, style }) => {
                              const item = filteredBooks[index];
                              const title =
                                activeTab === "browse"
                                  ? item.title
                                  : item.book?.title;
                              const author =
                                activeTab === "browse"
                                  ? item.author
                                  : item.book?.author;
                              const id = item._id;

                              return (
                                <div
                                  style={style}
                                  className="grid grid-cols-12 gap-4 items-center border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                                >
                                  <div className="col-span-5 py-4">
                                    <div className="flex items-center gap-4">
                                      <div>
                                        <p className="font-bold text-gray-800 group-hover:text-black truncate pr-4">
                                          {title || "Unknown Title"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {author || "Unknown Author"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {activeTab !== "browse" && (
                                    <>
                                      <div className="col-span-4 py-4 text-xs flex flex-col justify-center">
                                        <span>
                                          Out:{" "}
                                          {new Date(
                                            item.borrowedAt,
                                          ).toLocaleDateString()}
                                        </span>
                                        {item.returned ? (
                                          <span className="text-green-600">
                                            In:{" "}
                                            {new Date(
                                              item.returnedAt,
                                            ).toLocaleDateString()}
                                          </span>
                                        ) : (
                                          <span className="text-red-500">
                                            Due:{" "}
                                            {new Date(
                                              item.dueDate,
                                            ).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                      <div className="col-span-2 py-4 flex items-center">
                                        <span
                                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                            item.returned
                                              ? "bg-green-100 text-green-800"
                                              : new Date() >
                                                  new Date(item.dueDate)
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {item.returned
                                            ? "Completed"
                                            : new Date() >
                                                new Date(item.dueDate)
                                              ? "Overdue"
                                              : "Active"}
                                        </span>
                                      </div>
                                    </>
                                  )}

                                  {activeTab === "browse" && (
                                    <div className="col-span-5 py-4 flex items-center">
                                      <span
                                        className={`font-bold ${item.quantity > 0 ? "text-green-600" : "text-red-500"}`}
                                      >
                                        {item.quantity > 0
                                          ? `${item.quantity} Available`
                                          : "Out of Stock"}
                                      </span>
                                    </div>
                                  )}

                                  <div
                                    className={`py-4 flex items-center justify-end ${activeTab === "browse" ? "col-span-2" : "col-span-1"}`}
                                  >
                                    {activeTab === "borrowed" && (
                                      <button
                                        onClick={() => handleReturn(id)}
                                        className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-md active:scale-95"
                                      >
                                        RETURN
                                      </button>
                                    )}
                                    {activeTab === "browse" && (
                                      <button
                                        onClick={() => handleHire(id)}
                                        disabled={item.quantity <= 0}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-md active:scale-95 ${
                                          item.quantity > 0
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                      >
                                        {item.quantity > 0
                                          ? "HIRE"
                                          : "UNAVAILABLE"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            }}
                          </List>
                        )}
                      </AutoSizer>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <img
                        src={bookIcon}
                        alt="empty"
                        className="w-12 h-12 opacity-20"
                      />
                    </div>
                    <p className="text-gray-400 font-medium">
                      No records found in this category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUOTE SECTION - FULL WIDTH BOTTOM */}
        <div
          className="hidden xl:flex bg-white text-lg p-3 sm:text-xl 
            xl:text-xl min-h-0 h-24 font-semibold relative w-full
            justify-center items-center rounded-2xl shadow-sm border-2 
            border-gray-200 flex-none"
        >
          <h4 className="overflow-y-hidden text-center px-4 text-black">
            "A reader lives a thousand lives before he dies. The man who never
            reads lives
          </h4>
          <p
            className="text-gray-500 text-sm sm:text-base absolute right-[35px] 
              sm:right-[78px] bottom-[15px] font-bold"
          >
            ~ Developed by NEXUS TEAM
          </p>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;
