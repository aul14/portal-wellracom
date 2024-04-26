export async function checkUniqueness(model, field, value) {
    try {
        // Check if any record already exists with the provided field value
        const existingRecord = await model.findOne({
            where: {
                [field]: value
            }
        });

        return existingRecord;
    } catch (error) {
        console.error('Error checking uniqueness:', error);
        return true;
    }
}
