import { StyleSheet } from 'react-native';

export const appstyles = StyleSheet.create({
  header: {
    //paddingHorizontal: 10,
    //paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
  },
  list: {
    backgroundColor:"white"
  },
  item: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  footer: {
    padding: 5,
    fontSize:12,
  },
  footerText: {
    fontWeight: '500',
  },
  flatListRow: {
    flexDirection: "row",   
    height: 55,   
    alignItems:"center",
    padding: 10, 
    borderBottomWidth:0.5,borderBottomColor:"lightgrey" 
  }
});

export default appstyles;