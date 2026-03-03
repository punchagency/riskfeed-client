import { useState } from "react";

export const Loading = ({ fullPage = true }) => {
    const [timer, setTimer] = useState(0);
    setTimeout(() => { setTimer(timer + 1); }, 1200);
    const myClass = fullPage ? 'loading' : '';
    return (
        <div className={myClass + ' brand-modal'}>
            <div className='brand-modal-content' style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="" style={{ width: "80px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", opacity: "0.5", borderRadius: "10px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="80" height="80" style={{ shapeRendering: "auto", display: "block", background: "transparent" }} xmlnsXlink="http://www.w3.org/1999/xlink"><g><g transform="rotate(0 50 50)">
                        <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                            <animate repeatCount="indefinite" begin="-0.9166666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                        </rect>
                    </g><g transform="rotate(30 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.8333333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(60 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.75s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(90 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.6666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(120 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.5833333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(150 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.5s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(180 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.4166666666666667s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(210 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.3333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(240 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.25s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(270 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.16666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(300 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="-0.08333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g transform="rotate(330 50 50)">
                            <rect fill="#f5f5f4" height="12" width="6" ry="6" rx="3" y="24" x="47">
                                <animate repeatCount="indefinite" begin="0s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
                            </rect>
                        </g><g></g></g>
                    </svg>
                </div>
            </div>
        </div>
    );
};