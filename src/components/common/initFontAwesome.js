import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLink,
  faPowerOff,
  faUser,
  faUserCircle,
  faSignInAlt,
  faArrowRight,
  faPlus,
  faPlusCircle,
  faMinus,
  faBars,
  faChartLine,
  faUsers,
  faHouseUser,
  faCog,
  faUserGraduate,
  faHome,
  faSchool,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
  library.add(faLink);
  library.add(faUserCircle);
  library.add(faUser);
  library.add(faPowerOff);
  library.add(faSignInAlt);
  library.add(faArrowRight);
  library.add(faPlus);
  library.add(faPlusCircle);
  library.add(faMinus);
  library.add(faBars);
  library.add(faCog);
  library.add(faChartLine);
  library.add(faUsers);
  library.add(faHome);
  library.add(faHouseUser);
  library.add(faUserGraduate);
  library.add(faSchool);
  library.add(faCheckCircle);
  library.add(faTimesCircle);
}

export default initFontAwesome;
