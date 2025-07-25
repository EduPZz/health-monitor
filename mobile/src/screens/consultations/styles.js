import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  upcomingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  appointmentItem: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'column',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  doctorText: {
    fontSize: 12,
  },
  typeText: {
    fontSize: 12,
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#4A90E2',
  },
  addCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4A4949',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  specialtyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#666',
    borderRadius: 8,
    color: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#176B87',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFF',
  },
  dateCard: {
    backgroundColor: '#D0FBFF',
    padding: 8,
    borderRadius: 8
  },
  dateCardText: {
    color: '#383838',
  },
  addForm: {
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
    width: 'fit-content',
    justifyContent: 'flex-end',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  }
});

export default styles;