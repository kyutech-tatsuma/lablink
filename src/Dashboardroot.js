import React from 'react';
import './css/sb-admin-2.css';
import './css/sb-admin-2.min.css';
import './vendor/fontawesome-free/css/all.min.css';
import './Dashboardview.css';
import Dashboardcontent from './Dashboardcontent';
import { useState, useEffect } from 'react';
import Navigate from './Navigate';
import Tab from './Tab';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboardroot = ({ user_id, baseurl }) => {

    const username = localStorage.getItem('T-lab_username');

    const navigate = useNavigate();

    const [isHomeValues, setisHomeValues] = useState(true);

    const [showNavigateValues, setshowNavigateValues] = useState(false);
    // ユーザーデータを格納する状態変数
    const [loginuser, setloginuser] = useState("");
    // ユーザーがisadminかどうかを記憶する状態変数
    const [isAdmin, setisAdmin] = useState(false);
    // 管理者ページの表示を管理する状態変数
    const [isAdminView, setisAdminView] = useState(false);
    // 論文要約ページの表示を管理する状態変数
    const [isSummaryView, setisSummaryView] = useState(false);
    //論文検索ぺーじの表示を管理する状態変数
    const [isSearchpaper, setisSearchpaper] = useState(false);
    // 暇つぶしページの表示を管理する状態変数
    const [isplayground, setisplayground] = useState(false);

    let monthpay = 500;

    // 新しいstate変数を追加します
    const [catAnimation, setCatAnimation] = useState({
        moving: true,
        reversed: false
    });
    const [catImage, setCatImage] = useState("/img/gray_walk_8fps.gif");

    useEffect(() => {
        const catAnimationInterval = setInterval(() => {
            setCatAnimation(prevState => {
                if (prevState.moving) {
                    // 歩くアニメーションが終わったらボールで遊ぶアニメーションに切り替えます
                    setCatImage("/img/gray_with_ball_8fps.gif");
                    return { moving: false, reversed: prevState.reversed };
                } else {
                    // ボールで遊ぶアニメーションが終わったら反転して歩くアニメーションに切り替えます
                    setCatImage(prevState.reversed ? "/img/gray_walk_8fps.gif" : "/img/gray_walk_8fps_reversed.gif");
                    return { moving: true, reversed: !prevState.reversed };
                }
            });
        }, 30000); // 30秒ごとに状態を変更します。

        const catAnimationTimeout = setTimeout(() => {
            if (!catAnimation.moving) {
                // ボールで遊ぶアニメーションを10秒間表示した後、状態を更新します
                setCatAnimation(prevState => {
                    return { ...prevState, moving: true };
                });
            }
        }, 10000); // 10秒後に実行します

        // コンポーネントがアンマウントされたときにタイマーをクリアします
        return () => {
            clearInterval(catAnimationInterval);
            clearTimeout(catAnimationTimeout);
        };
    }, [catAnimation.moving]);


    async function getUserId(username) {
        try {
            console.log(baseurl + '/user')
            const response = await axios.get(baseurl + '/user');
            const users = response.data;

            const user = users.find(user => user.name === username);

            if (user) {
                return user.id;
            } else {
                console.log('失敗');
                console.log(response.data);
                return null;
            }
        } catch (error) {
            console.log('そもそも取れてないよー');
            console.error(error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('T-lab_username');
            navigate('/login');
        }
    };

    const showNavigate = () => {
        setshowNavigateValues(true);
    };

    const hideNavigate = () => {
        setshowNavigateValues(false);
    };

    const requests = {
        fetchloginuserinfo: `/user/get_user/${user_id}`
    };
    // ユーザーIDからユーザーの情報を取得する
    useEffect(() => {
        //データを取得する非同期関数を定義し、その関数を実行する
        async function fetchData() {
            try {
                //axiosを利用し、データを取得
                axios.get(baseurl + requests.fetchloginuserinfo).then((res) => {
                    if (res.data) {
                        console.log('ユーザー情報が取れています。')
                        setloginuser(res.data["name"]);
                        setisAdmin(res.data['is_admin']);
                    } else {
                        console.log('ユーザー情報が取れていません')
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('T-lab_username');
                        navigate('/login');
                    }
                });
            } catch (error) {
                console.error(error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('T-lab_username');
                navigate('/login');
            }
        }
        fetchData();
    }, [user_id]);

    useEffect(() => {
        getUserId(username).then(id => {
            console.log(user_id !== id);
            console.log(user_id);
            console.log(id);
            if (Number(user_id) !== Number(id)) {
                console.log('user!==id');
                console.log(typeof(user_id));
                console.log(typeof(id));
                localStorage.removeItem('access_token');
                localStorage.removeItem('T-lab_username');
                navigate('/login');
            }
        })
    }, []);

    return (
        <>
            {/* <!-- Page Wrapper --> */}
            <div id="page-top">
                <div id="wrapper">

                    {/* <!-- Sidebar --> */}
                    <Navigate user_id={user_id} setisHomeValues={setisHomeValues} showNavigateValues={showNavigateValues} setshowNavigateValues={setshowNavigateValues} isAdmin={isAdmin} setisAdminView={setisAdminView} isSummaryView={isSummaryView} setisSummaryView={setisSummaryView} isSearchpaper={isSearchpaper} setisSearchpaper={setisSearchpaper} isplayground={isplayground} setisplayground={setisplayground} />

                    {/* <!-- Content Wrapper --> */}
                    <div id="content-wrapper" className="d-flex flex-column">

                        {/* <!-- Main Content --> */}
                        <div id="content">

                            {/* <!-- Topbar --> */}
                            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                                {/* <!-- Sidebar Toggle (Topbar) --> */}
                                <Tab showNavigateValues={showNavigateValues} showNavigate={showNavigate} />


                                {/* <!-- Topbar Navbar --> */}
                                <ul className="navbar-nav ml-auto">


                                    <div className="topbar-divider d-none d-sm-block"></div>

                                    {/* <!-- Nav Item - User Information --> */}
                                    <li className="nav-item dropdown no-arrow">
                                        <a className="nav-link dropdown-toggle" id="userDropdown" role="button"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={hideNavigate}>
                                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{loginuser}</span>
                                            {/* <img class="img-profile rounded-circle" */}
                                            {/* src="#" /> */}
                                            <i className="fas fa-solid fa-user fa-2s text-gray-300"></i>
                                        </a>
                                    </li>

                                </ul>

                            </nav>
                            {/* ページのコンテンツ部分 */}
                            <Dashboardcontent isHome={isHomeValues} isAdminView={isAdminView} isSummaryView={isSummaryView} isSearchpaper={isSearchpaper} isplayground={isplayground} user_id={user_id} baseurl={baseurl} monthpay={monthpay} />
                        </div>
                    </div>
                </div>
                {/* <!-- End of Page Wrapper --> */}
                <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright &copy; Takemura Lab</span>
                    </div>
                </div>
                <div className="cat-animation" style={{ transform: catAnimation.reversed ? 'scaleX(-1)' : 'scaleX(1)' }}>
                <img className="cat-image" src={catImage} alt="Walking Cat" />
                </div>
                </footer>
                {/* <!-- Scroll to Top Button--> */}
                <a className="scroll-to-top rounded" href="#page-top">
                    <i className="fas fa-angle-up"></i>
                </a>
            </div>
        </>
    );
};

export default Dashboardroot;