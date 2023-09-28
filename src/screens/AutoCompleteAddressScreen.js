import React from 'react';
import { Box, Text } from 'react-native-design-utility';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import {
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  LogBox,
} from 'react-native';

import { GOOGLE_API_KEY } from '../constants';
import { theme } from '../constants/theme';
import LocationItem from '../components/LocationItem';
import { strings } from '../lang';

/*YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);*/

//LogBox.ignoreLogs();
const AutoCompleteAddressScreen = ({ route }) => (
  <Box f={1} bg="white">
    <GoogleAutoComplete apiKey={GOOGLE_API_KEY} components="country:fr">
      {({
        handleTextChange,
        inputValue,
        locationResults,
        isSearching,
        fetchDetails,
      }) => (
          <React.Fragment>
            <Box h={40} w="100%" center mt={10}>
              <Box bg="greyLighter" radius={6} h="90%" w="90%" p={8}>
                <TextInput
                  placeholder="Search address"
                  selectionColor={theme.color.green}
                  autoFocus
                  onChangeText={handleTextChange}
                  value={inputValue}
                />
              </Box>
            </Box>

            {isSearching && locationResults.length === 0 ? (
              <Box h="100%" w="100%" center>
                <ActivityIndicator color={theme.color.green} size="large" />
              </Box>
            ) : (
                <ScrollView style={styles.list}>
                  {locationResults.map((location, index) => (
                    <LocationItem
                      key={index}
                      {...location}
                      fetchDetails={fetchDetails}
                      searchAddress={route.params.searchAddress}
                    />
                  ))}
                </ScrollView>
              )}
          </React.Fragment>
        )}
    </GoogleAutoComplete>
  </Box>
);



const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
  list: {
    marginTop: 10,
  },
});

export default AutoCompleteAddressScreen;