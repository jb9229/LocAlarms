import {createActions} from "reduxsauce";

const {Types, Creators} = createActions({
  search: ['searchTerm'],
  cancelSearch: null
});
